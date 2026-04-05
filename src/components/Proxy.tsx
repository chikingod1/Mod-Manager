import { useState } from 'react';
import { Search, ExternalLink, Shield, Zap } from 'lucide-react';

export default function Proxy() {
  const [url, setUrl] = useState('');
  const [proxyUrl, setProxyUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }

    setProxyUrl(formattedUrl);
    setTimeout(() => setLoading(false), 500);
  };

  const quickLinks = [
    { name: 'YouTube', url: 'https://youtube.com' },
    { name: 'Discord', url: 'https://discord.com' },
    { name: 'Reddit', url: 'https://reddit.com' },
    { name: 'Twitter', url: 'https://twitter.com' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Web Unblocker</h2>
        </div>
        <p className="text-blue-100 mb-6">
          Access any website securely and privately. Your gateway to the open internet.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL (e.g., youtube.com)"
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-blue-600 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Zap className="w-5 h-5 animate-pulse" />
                Loading...
              </>
            ) : (
              <>
                <ExternalLink className="w-5 h-5" />
                Unblock & Browse
              </>
            )}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-sm text-blue-100 mb-3">Quick Access:</p>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  setUrl(link.url);
                  setProxyUrl(link.url);
                }}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {proxyUrl && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gray-800 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium">Secure Connection</span>
            </div>
            <span className="text-gray-400 text-sm truncate max-w-md">{proxyUrl}</span>
          </div>
          <div className="relative" style={{ height: 'calc(100vh - 400px)', minHeight: '500px' }}>
            <iframe
              src={proxyUrl}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              title="Proxy Browser"
            />
          </div>
        </div>
      )}

      {!proxyUrl && (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800">Secure Browsing</h4>
              <p className="text-sm text-gray-600">Browse websites with enhanced privacy and security.</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-cyan-600" />
              </div>
              <h4 className="font-semibold text-gray-800">Lightning Fast</h4>
              <p className="text-sm text-gray-600">Quick loading times with optimized performance.</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800">Universal Access</h4>
              <p className="text-sm text-gray-600">Access any website without restrictions.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
