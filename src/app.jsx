import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, Edit2, Trash2, Moon, Sun, Download, Upload, 
  ExternalLink, Sparkles, Move, FolderPlus, Settings, Check, 
  X, RefreshCw, LayoutGrid, Globe, Compass, Bookmark, ShieldAlert, ChevronRight
} from 'lucide-react';

// Default initial dataset with well-known web shortcuts categorized neatly
const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'General & Daily', icon: 'Globe' },
  { id: 'cat-2', name: 'Teaching & ELA', icon: 'Sparkles' },
  { id: 'cat-3', name: 'Media & Tech', icon: 'LayoutGrid' },
  { id: 'cat-4', name: 'Webcomics', icon: 'Compass' },
  { id: 'cat-5', name: 'Personal & News', icon: 'Bookmark' }
];

const DEFAULT_TILES = [
  // General & Daily
  { id: 't-1', catId: 'cat-1', title: 'Google Search', url: 'https://www.google.com', bg: 'from-blue-600 to-indigo-600', icon: '' },
  { id: 't-2', catId: 'cat-1', title: 'Gmail', url: 'https://mail.google.com', bg: 'from-red-500 to-rose-600', icon: '' },
  { id: 't-3', catId: 'cat-1', title: 'Google Calendar', url: 'https://calendar.google.com', bg: 'from-blue-500 to-cyan-600', icon: '' },
  { id: 't-4', catId: 'cat-1', title: 'Wikipedia', url: 'https://www.wikipedia.org', bg: 'from-zinc-600 to-stone-700', icon: '' },
  { id: 't-5', catId: 'cat-1', title: 'Weather.com', url: 'https://weather.com', bg: 'from-sky-500 to-blue-600', icon: '' },
  
  // Teaching & ELA
  { id: 't-6', catId: 'cat-2', title: 'Google Classroom', url: 'https://classroom.google.com', bg: 'from-emerald-500 to-teal-600', icon: '' },
  { id: 't-7', catId: 'cat-2', title: 'Kahoot!', url: 'https://kahoot.com', bg: 'from-purple-600 to-indigo-700', icon: '' },
  { id: 't-8', catId: 'cat-2', title: 'Quizlet', url: 'https://quizlet.com', bg: 'from-blue-600 to-cyan-700', icon: '' },
  { id: 't-9', catId: 'cat-2', title: 'CommonLit', url: 'https://www.commonlit.org', bg: 'from-amber-600 to-orange-600', icon: '' },
  { id: 't-10', catId: 'cat-2', title: 'ReadWorks', url: 'https://www.readworks.org', bg: 'from-cyan-600 to-teal-700', icon: '' },
  { id: 't-11', catId: 'cat-2', title: 'Canva', url: 'https://www.canva.com', bg: 'from-teal-400 to-blue-500', icon: '' },

  // Media & Tech
  { id: 't-12', catId: 'cat-3', title: 'YouTube', url: 'https://www.youtube.com', bg: 'from-red-600 to-red-700', icon: '' },
  { id: 't-13', catId: 'cat-3', title: 'GitHub', url: 'https://github.com', bg: 'from-gray-700 to-zinc-900', icon: '' },
  { id: 't-14', catId: 'cat-3', title: 'Reddit', url: 'https://reddit.com', bg: 'from-orange-500 to-amber-600', icon: '' },
  { id: 't-15', catId: 'cat-3', title: 'Stack Overflow', url: 'https://stackoverflow.com', bg: 'from-amber-500 to-orange-600', icon: '' },
  { id: 't-16', catId: 'cat-3', title: 'Spotify', url: 'https://open.spotify.com', bg: 'from-emerald-600 to-green-700', icon: '' },

  // Webcomics
  { id: 't-17', catId: 'cat-4', title: 'xkcd', url: 'https://xkcd.com', bg: 'from-slate-700 to-slate-900', icon: '' },
  { id: 't-18', catId: 'cat-4', title: 'Webtoon', url: 'https://www.webtoons.com', bg: 'from-emerald-500 to-teal-600', icon: '' },
  { id: 't-19', catId: 'cat-4', title: 'SMBC', url: 'https://www.smbc-comics.com', bg: 'from-indigo-600 to-purple-800', icon: '' },

  // Personal & News
  { id: 't-20', catId: 'cat-5', title: 'BBC News', url: 'https://www.bbc.com/news', bg: 'from-red-700 to-rose-900', icon: '' },
  { id: 't-21', catId: 'cat-5', title: 'NPR', url: 'https://www.npr.org', bg: 'from-blue-700 to-indigo-900', icon: '' },
  { id: 't-22', catId: 'cat-5', title: 'Amazon', url: 'https://www.amazon.com', bg: 'from-amber-600 to-yellow-700', icon: '' }
];

const COLOR_PRESETS = [
  { name: 'Indigo Gradient', value: 'from-indigo-600 to-purple-600' },
  { name: 'Blue Gradient', value: 'from-blue-600 to-cyan-600' },
  { name: 'Emerald Gradient', value: 'from-emerald-600 to-teal-600' },
  { name: 'Rose Gradient', value: 'from-rose-600 to-pink-600' },
  { name: 'Amber Gradient', value: 'from-amber-500 to-orange-600' },
  { name: 'Slate Dark', value: 'from-slate-700 to-zinc-900' },
  { name: 'Teal/Cyan', value: 'from-teal-500 to-emerald-700' },
  { name: 'Violet/Fuchsia', value: 'from-violet-600 to-fuchsia-700' }
];

function getDomain(urlStr) {
  try {
    let formattedUrl = urlStr;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    const parsed = new URL(formattedUrl);
    return parsed.hostname;
  } catch (e) {
    return urlStr;
  }
}

function getFaviconUrl(urlStr) {
  const domain = getDomain(urlStr);
  if (!domain) return '';
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export default function App() {
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('sym_categories');
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch (e) {
      return DEFAULT_CATEGORIES;
    }
  });

  const [tiles, setTiles] = useState(() => {
    try {
      const saved = localStorage.getItem('sym_tiles');
      return saved ? JSON.parse(saved) : DEFAULT_TILES;
    } catch (e) {
      return DEFAULT_TILES;
    }
  });

  const [activeTab, setActiveTab] = useState(() => categories[0]?.id || 'cat-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEngine, setSearchEngine] = useState('google');
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('sym_theme');
      return saved ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  const [failedFavicons, setFailedFavicons] = useState({});
  const [isTileModalOpen, setIsTileModalOpen] = useState(false);
  const [editingTile, setEditingTile] = useState(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  const [tileForm, setTileForm] = useState({
    title: '',
    url: '',
    catId: '',
    bg: COLOR_PRESETS[0].value,
    customIcon: ''
  });

  const [catNameInput, setCatNameInput] = useState('');
  const [draggedTileId, setDraggedTileId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('sym_categories', JSON.stringify(categories));
    } catch (e) {}
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('sym_tiles', JSON.stringify(tiles));
    } catch (e) {}
  }, [tiles]);

  useEffect(() => {
    try {
      localStorage.setItem('sym_theme', JSON.stringify(darkMode));
    } catch (e) {}
  }, [darkMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    let engineUrl = '';
    if (searchEngine === 'google') {
      engineUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    } else if (searchEngine === 'ddg') {
      engineUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`;
    } else if (searchEngine === 'bing') {
      engineUrl = `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`;
    }
    window.open(engineUrl, '_blank');
  };

  const filteredTiles = tiles.filter((tile) => {
    const matchesSearch = tile.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tile.url.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (searchQuery.trim().length > 0) {
      return matchesSearch;
    }
    return tile.catId === activeTab;
  });

  const handleOpenTileModal = (tile = null) => {
    if (tile) {
      setEditingTile(tile);
      setTileForm({
        title: tile.title,
        url: tile.url,
        catId: tile.catId,
        bg: tile.bg,
        customIcon: tile.icon || ''
      });
    } else {
      setEditingTile(null);
      setTileForm({
        title: '',
        url: '',
        catId: activeTab || (categories[0] && categories[0].id) || '',
        bg: COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)].value,
        customIcon: ''
      });
    }
    setIsTileModalOpen(true);
  };

  const handleSaveTile = (e) => {
    e.preventDefault();
    let formattedUrl = tileForm.url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    if (editingTile) {
      setTiles(tiles.map(t => t.id === editingTile.id ? {
        ...t,
        title: tileForm.title.trim() || 'Shortcut',
        url: formattedUrl,
        catId: tileForm.catId,
        bg: tileForm.bg,
        icon: tileForm.customIcon.trim()
      } : t));
    } else {
      const newTile = {
        id: 'tile-' + Date.now(),
        title: tileForm.title.trim() || 'Shortcut',
        url: formattedUrl,
        catId: tileForm.catId,
        bg: tileForm.bg,
        icon: tileForm.customIcon.trim()
      };
      setTiles([...tiles, newTile]);
    }

    setIsTileModalOpen(false);
  };

  const handleDeleteTile = (id) => {
    setTiles(tiles.filter(t => t.id !== id));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!catNameInput.trim()) return;
    const newCat = {
      id: 'cat-' + Date.now(),
      name: catNameInput.trim(),
      icon: 'Bookmark'
    };
    setCategories([...categories, newCat]);
    setActiveTab(newCat.id);
    setCatNameInput('');
    setIsCatModalOpen(false);
  };

  const handleDeleteCategory = (catId, e) => {
    e.stopPropagation();
    if (categories.length <= 1) return;
    const nextCats = categories.filter(c => c.id !== catId);
    setCategories(nextCats);
    setTiles(tiles.filter(t => t.catId !== catId));
    if (activeTab === catId) {
      setActiveTab(nextCats[0].id);
    }
  };

  const handleExportData = () => {
    const dataObj = { categories, tiles, version: '1.0' };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataObj, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `symbaloo_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.categories && parsed.tiles) {
            setCategories(parsed.categories);
            setTiles(parsed.tiles);
            if (parsed.categories.length > 0) {
              setActiveTab(parsed.categories[0].id);
            }
          }
        } catch (err) {
          console.error("Error parsing backup file", err);
        }
      };
    }
  };

  const handleDragStart = (e, tileId) => {
    setDraggedTileId(tileId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetTileId) => {
    e.preventDefault();
    if (!draggedTileId || draggedTileId === targetTileId) return;

    const sourceIdx = tiles.findIndex(t => t.id === draggedTileId);
    const targetIdx = tiles.findIndex(t => t.id === targetTileId);

    if (sourceIdx !== -1 && targetIdx !== -1) {
      const updated = [...tiles];
      const [removed] = updated.splice(sourceIdx, 1);
      updated.splice(targetIdx, 0, removed);
      setTiles(updated);
    }
    setDraggedTileId(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      <header className={`sticky top-0 z-20 border-b backdrop-blur-md ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-xl">
              S
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg leading-none tracking-tight">LaunchGrid</h1>
              <p className="text-xs text-slate-400 font-medium">Bookmark Dashboard</p>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder={`Search shortcuts or search with ${searchEngine.toUpperCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-28 py-2 text-sm rounded-full border transition-all outline-none ${
                  darkMode 
                    ? 'bg-slate-800/90 border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' 
                    : 'bg-slate-100 border-slate-300 text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
                }`}
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSearchEngine('google')}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-full transition ${
                    searchEngine === 'google' ? 'bg-indigo-600 text-white' : darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Google Search"
                >
                  G
                </button>
                <button
                  type="button"
                  onClick={() => setSearchEngine('ddg')}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-full transition ${
                    searchEngine === 'ddg' ? 'bg-orange-600 text-white' : darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="DuckDuckGo Search"
                >
                  DDG
                </button>
              </div>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenTileModal(null)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">Add Tile</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border transition ${
                darkMode ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Toggle Dark/Light mode"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={handleExportData}
              className={`p-2 rounded-lg border transition ${
                darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Export Settings & Bookmarks (JSON)"
            >
              <Download className="h-4 w-4" />
            </button>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportData} 
              accept=".json" 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-lg border transition ${
                darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Import JSON Backup"
            >
              <Upload className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-800/40">
          <div className="flex items-center gap-2">
            {categories.map((cat) => {
              const isActive = activeTab === cat.id && !searchQuery.trim();
              return (
                <div key={cat.id} className="relative group flex-shrink-0">
                  <button
                    onClick={() => {
                      setActiveTab(cat.id);
                      setSearchQuery('');
                    }}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : darkMode
                        ? 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {categories.length > 1 && (
                      <span
                        onClick={(e) => handleDeleteCategory(cat.id, e)}
                        className={`opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-black/20 transition ${isActive ? 'text-white/80' : 'text-slate-400'}`}
                        title="Delete category tab"
                      >
                        <X className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                </div>
              );
            })}

            <button
              onClick={() => setIsCatModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-dashed transition flex-shrink-0 ${
                darkMode ? 'border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700' : 'border-slate-300 text-slate-500 hover:text-slate-800 hover:border-slate-400'
              }`}
            >
              <FolderPlus className="h-4 w-4" />
              <span>New Tab</span>
            </button>
          </div>
        </div>

        {searchQuery.trim() && (
          <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
            <span>Filtering tiles matching: <strong className="text-indigo-400">"{searchQuery}"</strong></span>
            <button onClick={() => setSearchQuery('')} className="hover:underline text-indigo-400">
              Clear Filter
            </button>
          </div>
        )}

        {filteredTiles.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border ${darkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'}`}>
            <LayoutGrid className="h-12 w-12 mx-auto text-slate-500 mb-3 opacity-50" />
            <h3 className="text-base font-semibold">No shortcut tiles found</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery.trim() ? 'Try adjusting your search query or clear the filter.' : 'Add your first tile shortcut to customize this dashboard.'}
            </p>
            <button
              onClick={() => handleOpenTileModal(null)}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow transition"
            >
              Add New Tile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
            {filteredTiles.map((tile) => {
              const faviconSrc = tile.icon || getFaviconUrl(tile.url);
              const isFaviconFailed = failedFavicons[tile.id];

              return (
                <div
                  key={tile.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, tile.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, tile.id)}
                  className={`group relative aspect-square rounded-2xl p-3 flex flex-col justify-between cursor-pointer border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br ${tile.bg} ${
                    darkMode ? 'border-white/10 shadow-black/40' : 'border-black/5 shadow-slate-200'
                  }`}
                  onClick={() => window.open(tile.url, '_blank')}
                >
                  <div 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10 bg-slate-900/80 backdrop-blur p-1 rounded-lg border border-slate-700/50 shadow-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button onClick={() => handleOpenTileModal(tile)} className="p-1 hover:text-indigo-300 text-slate-300 transition" title="Edit Tile">
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button onClick={() => handleDeleteTile(tile.id)} className="p-1 hover:text-red-400 text-slate-300 transition" title="Delete Tile">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between w-full">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center p-2 shadow-inner border border-white/20 overflow-hidden">
                      {faviconSrc && !isFaviconFailed ? (
                        <img 
                          src={faviconSrc} 
                          alt={tile.title} 
                          className="w-full h-full object-contain rounded drop-shadow"
                          onError={() => {
                            setFailedFavicons(prev => ({ ...prev, [tile.id]: true }));
                          }}
                        />
                      ) : (
                        <span className="font-bold text-white text-lg">{tile.title.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-60 text-white cursor-grab">
                      <Move className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <div className="mt-auto pt-2">
                    <h3 className="font-semibold text-white text-sm line-clamp-1 leading-snug drop-shadow-sm">
                      {tile.title}
                    </h3>
                    <p className="text-[11px] text-white/70 line-clamp-1 truncate font-mono mt-0.5">
                      {getDomain(tile.url)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* TILE MODAL */}
      {isTileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editingTile ? 'Edit Shortcut Tile' : 'Add New Shortcut Tile'}</h2>
              <button onClick={() => setIsTileModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Target URL *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://google.com"
                  value={tileForm.url}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTileForm(prev => {
                      const domain = getDomain(val);
                      const suggestedTitle = domain ? domain.split('.')[0] : '';
                      return {
                        ...prev,
                        url: val,
                        title: prev.title || (suggestedTitle ? suggestedTitle.charAt(0).toUpperCase() + suggestedTitle.slice(1) : '')
                      };
                    });
                  }}
                  className={`w-full px-3 py-2 text-sm rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Title / Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Search"
                  value={tileForm.title}
                  onChange={(e) => setTileForm({ ...tileForm, title: e.target.value })}
                  className={`w-full px-3 py-2 text-sm rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Category Tab</label>
                <select
                  value={tileForm.catId}
                  onChange={(e) => setTileForm({ ...tileForm, catId: e.target.value })}
                  className={`w-full px-3 py-2 text-sm rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Custom Icon URL (Optional)</label>
                <input
                  type="text"
                  placeholder="Auto-generated if left blank"
                  value={tileForm.customIcon}
                  onChange={(e) => setTileForm({ ...tileForm, customIcon: e.target.value })}
                  className={`w-full px-3 py-2 text-sm rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tile Background Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setTileForm({ ...tileForm, bg: preset.value })}
                      className={`h-9 rounded-lg bg-gradient-to-r ${preset.value} flex items-center justify-center border transition ${
                        tileForm.bg === preset.value ? 'ring-2 ring-indigo-500 border-white' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      {tileForm.bg === preset.value && <Check className="h-4 w-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsTileModalOpen(false)} className={`px-4 py-2 text-sm rounded-lg border ${darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow">
                  Save Shortcut
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl p-6 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Add Category Tab</h2>
              <button onClick={() => setIsCatModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tab Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Work, Tech, Research"
                  value={catNameInput}
                  onChange={(e) => setCatNameInput(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className={`px-4 py-2 text-sm rounded-lg border ${darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow">
                  Create Tab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
