using System;
using System.Collections.Generic;
using Jellyfin.Plugin.ModManager.Configuration;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Serialization;
using Microsoft.Extensions.Logging;

namespace Jellyfin.Plugin.ModManager
{
    public class Plugin : BasePlugin<PluginConfiguration>, IHasWebPages
    {
        public override string Name => "ModManager";

        public override Guid Id => Guid.Parse("c3d4e5f6-a7b8-9012-cdef-345678901234");

        public override string Description => "Mod store that injects community JS and CSS mods via File Transformation.";

        public static Plugin Instance { get; private set; }

        public IServiceProvider ServiceProvider { get; private set; }

        public Plugin(
            IApplicationPaths applicationPaths,
            IXmlSerializer xmlSerializer,
            ILogger<Plugin> logger,
            IServiceProvider serviceProvider)
            : base(applicationPaths, xmlSerializer)
        {
            Instance = this;
            ServiceProvider = serviceProvider;
        }

        public IEnumerable<PluginPageInfo> GetPages()
        {
            return new[]
            {
                new PluginPageInfo
                {
                    Name = this.Name,
                    DisplayName = "Mod Manager",
                    EnableInMainMenu = true,
                    EmbeddedResourcePath = $"{GetType().Namespace}.Configuration.configPage.html"
                }
            };
        }
    }
}
