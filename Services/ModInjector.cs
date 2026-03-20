using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.RegularExpressions;
using Jellyfin.Plugin.ModManager.Configuration;

namespace Jellyfin.Plugin.ModManager.Services
{
    public static class ModInjector
    {
        private const string StartMarker = "<!-- ModManager-Start -->";
        private const string EndMarker = "<!-- ModManager-End -->";

        private static readonly JsonSerializerOptions JsonOpts = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        private static void Log(bool debug, string msg)
        {
            if (debug) Console.Error.WriteLine("[ModManager] " + msg);
        }

        public static string InjectMods(PatchRequestPayload payload)
        {
            try
            {
                string html = payload?.Contents;
                if (string.IsNullOrEmpty(html))
                    return html ?? string.Empty;

                PluginConfiguration config = Plugin.Instance?.Configuration;
                if (config == null)
                    return html;

                bool dbg = config.DebugLogging;

                if (!html.Contains("</body>"))
                {
                    return html;
                }

                Log(dbg, $"InjectMods called. HTML length: {html.Length}, has </body>: True");
                Log(dbg, $"EnabledMods: {config.EnabledMods?.Count ?? 0}, CachedMods length: {config.CachedMods?.Length ?? 0}");

                if (config.EnabledMods == null || config.EnabledMods.Count == 0)
                {
                    Log(dbg, "No mods enabled — skipping");
                    return html;
                }

                List<ModEntry> allMods = LoadCachedMods(config.CachedMods, dbg);
                if (allMods == null || allMods.Count == 0)
                {
                    Log(dbg, "CachedMods empty or failed to parse — load and save mods in config first");
                    return html;
                }

                Log(dbg, $"Cached mod count: {allMods.Count}. IDs: {string.Join(", ", allMods.ConvertAll(m => m.Id))}");

                html = Regex.Replace(
                    html,
                    $@"{Regex.Escape(StartMarker)}[\s\S]*?{Regex.Escape(EndMarker)}\n?",
                    string.Empty);

                var cssUrls = new List<string>();
                var cssInlines = new List<string>();
                var jsUrls = new List<string>();
                var jsInlines = new List<string>();

                foreach (string modId in config.EnabledMods)
                {
                    string trimmedId = modId?.Trim();
                    ModEntry mod = allMods.Find(m => string.Equals(m.Id?.Trim(), trimmedId, StringComparison.OrdinalIgnoreCase));
                    if (mod == null)
                    {
                        Log(dbg, $"Mod '{trimmedId}' not found in cache");
                        continue;
                    }

                    string type = (mod.Type ?? string.Empty).ToLowerInvariant();
                    bool hasCss = type == "css" || type == "both";
                    bool hasJs = type == "js" || type == "both";

                    Log(dbg, $"Processing mod: '{mod.Name}' type={type} hasCss={hasCss} hasJs={hasJs} cssUrl='{mod.CssUrl}' jsUrl='{mod.JsUrl}'");

                    if (hasCss)
                    {
                        if (!string.IsNullOrWhiteSpace(mod.CssUrl))
                        {
                            Log(dbg, $"  -> adding CSS URL: {mod.CssUrl}");
                            cssUrls.Add(mod.CssUrl);
                        }
                        else if (!string.IsNullOrWhiteSpace(mod.CssInline))
                        {
                            Log(dbg, $"  -> adding CSS inline ({mod.CssInline.Length} chars)");
                            cssInlines.Add(mod.CssInline);
                        }
                        else
                        {
                            Log(dbg, "  -> CSS mod has no cssUrl or cssInline — nothing to inject");
                        }
                    }
                    if (hasJs)
                    {
                        if (!string.IsNullOrWhiteSpace(mod.JsUrl))
                        {
                            Log(dbg, $"  -> adding JS URL: {mod.JsUrl}");
                            jsUrls.Add(mod.JsUrl);
                        }
                        else if (!string.IsNullOrWhiteSpace(mod.JsInline))
                        {
                            Log(dbg, $"  -> adding JS inline ({mod.JsInline.Length} chars)");
                            jsInlines.Add(mod.JsInline);
                        }
                        else
                        {
                            Log(dbg, "  -> JS mod has no jsUrl or jsInline — nothing to inject");
                        }
                    }
                }

                Log(dbg, $"Totals — cssUrls: {cssUrls.Count}, cssInlines: {cssInlines.Count}, jsUrls: {jsUrls.Count}, jsInlines: {jsInlines.Count}");

                string injection = string.Empty;

                if (cssUrls.Count > 0 || cssInlines.Count > 0 || jsUrls.Count > 0 || jsInlines.Count > 0)
                    injection += BuildLoaderBlock(cssUrls, cssInlines, jsUrls, jsInlines);

                if (!string.IsNullOrEmpty(injection))
                {
                    string block = $"\n{StartMarker}\n{injection}{EndMarker}\n";
                    string before = html;
                    html = Regex.Replace(html, @"(</body>)", block + "$1");
                    Log(dbg, html == before
                        ? "WARNING: </body> not found — injection failed"
                        : $"Injected successfully. New length: {html.Length}");
                    Log(dbg, $"Injection block:\n{injection}");
                }
                else
                {
                    Log(dbg, "Injection block empty — nothing to inject");
                }

                return html;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[ModManager] EXCEPTION: {ex}");
                return payload?.Contents ?? string.Empty;
            }
        }

        private static List<ModEntry> LoadCachedMods(string json, bool dbg)
        {
            if (string.IsNullOrWhiteSpace(json)) return null;
            try
            {
                return JsonSerializer.Deserialize<List<ModEntry>>(json, JsonOpts);
            }
            catch (Exception ex)
            {
                Log(dbg, $"Failed to deserialize CachedMods: {ex.Message}");
                return null;
            }
        }

        private static string BuildLoaderBlock(
            List<string> cssUrls, List<string> cssInlines,
            List<string> jsUrls, List<string> jsInlines)
        {
            var cssUrlsJson = new System.Text.StringBuilder("[");
            for (int i = 0; i < cssUrls.Count; i++)
            {
                if (i > 0) cssUrlsJson.Append(",");
                cssUrlsJson.Append($"\"{EscapeJs(cssUrls[i])}\"");
            }
            cssUrlsJson.Append("]");

            var jsUrlsJson = new System.Text.StringBuilder("[");
            for (int i = 0; i < jsUrls.Count; i++)
            {
                if (i > 0) jsUrlsJson.Append(",");
                jsUrlsJson.Append($"\"{EscapeJs(jsUrls[i])}\"");
            }
            jsUrlsJson.Append("]");

            var cssInlineBlock = new System.Text.StringBuilder();
            foreach (string inline in cssInlines)
                cssInlineBlock.Append(inline).Append("\n");

            var jsInlineBlock = new System.Text.StringBuilder();
            foreach (string inline in jsInlines)
                jsInlineBlock.Append(inline).Append("\n");

            return $@"<script>
(function() {{
    if (window.__modManagerLoaded) return;
    window.__modManagerLoaded = true;

    var cssUrls = {cssUrlsJson};
    var jsUrls  = {jsUrlsJson};

    function injectCss(code) {{
        var s = document.createElement('style');
        s.setAttribute('data-modmanager', '1');
        s.textContent = code;
        document.head.appendChild(s);
    }}

    function injectJs(code) {{
        var s = document.createElement('script');
        s.setAttribute('data-modmanager', '1');
        s.textContent = code;
        document.head.appendChild(s);
    }}

    function run() {{
        {(cssInlineBlock.Length > 0 ? $"injectCss({JsonSerializer.Serialize(cssInlineBlock.ToString())});" : "")}
        {(jsInlineBlock.Length > 0 ? $"injectJs({JsonSerializer.Serialize(jsInlineBlock.ToString())});" : "")}

        cssUrls.forEach(function(url) {{
            fetch(url)
                .then(function(r) {{ return r.text(); }})
                .then(function(code) {{ injectCss(code); }})
                .catch(function(e) {{ console.warn('[ModManager] Failed to load CSS: ' + url, e); }});
        }});

        jsUrls.forEach(function(url) {{
            fetch(url)
                .then(function(r) {{ return r.text(); }})
                .then(function(code) {{ injectJs(code); }})
                .catch(function(e) {{ console.warn('[ModManager] Failed to load JS: ' + url, e); }});
        }});
    }}

    if (document.readyState === 'loading') {{
        document.addEventListener('DOMContentLoaded', run);
    }} else {{
        run();
    }}
}})();
</script>
";
        }


        private static string EscapeJs(string s)
        {
            return s.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\n", "\\n");
        }
    }

    public class ModEntry
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Author { get; set; }
        public string Description { get; set; }
        public string Version { get; set; }
        public string Type { get; set; }
        public string CssUrl { get; set; }
        public string CssInline { get; set; }
        public string JsUrl { get; set; }
        public string JsInline { get; set; }
        public string PreviewUrl { get; set; }
        public string SourceUrl { get; set; }
        public string Jellyfin { get; set; }
        public List<string> Tags { get; set; }
    }
}