import React, { useState } from 'react';
import { Play, Video, X } from 'lucide-react';
import { useWorkspace } from '@/hooks/useWorkspace';
import type { VideoPost } from '@/services/workspaceService';

const getVideoPlayerUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const videoId = parsed.hostname.includes('youtu.be')
      ? parsed.pathname.slice(1)
      : parsed.hostname.includes('youtube.com')
        ? parsed.searchParams.get('v')
        : null;
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  } catch {
    return url;
  }
  return url;
};

const isDirectVideo = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

export const VideosPage: React.FC = () => {
  const { videos } = useWorkspace();
  const [selectedVideo, setSelectedVideo] = useState<VideoPost | null>(null);

  return (
    <div className="space-y-6 pb-12">
      <header>
        <div className="flex items-center gap-2 text-rose-600"><Video className="h-6 w-6" /><span className="text-xs font-bold uppercase tracking-[0.16em]">Médias ADEC</span></div>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">Vidéos & prises de parole</h1>
        <p className="mt-1 text-sm text-slate-500">Découvrez les messages et contenus vidéo publiés pour les équipes.</p>
      </header>

      {videos.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <Video className="mx-auto h-9 w-9 text-slate-300" />
          <h2 className="mt-3 font-bold text-slate-800">Aucune vidéo publiée pour le moment</h2>
          <p className="mt-1 text-sm text-slate-500">Les prochaines vidéos partagées par l’administration apparaîtront ici avec leur aperçu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <article key={video.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <button type="button" onClick={() => setSelectedVideo(video)} className="group relative block aspect-video w-full overflow-hidden bg-slate-900 text-left" aria-label={`Prévisualiser ${video.title}`}>
                <img src={video.thumbnailUrl} alt="" className="h-full w-full object-cover opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-75" />
                <span className="absolute inset-0 flex items-center justify-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-rose-600 shadow-lg transition group-hover:scale-110"><Play className="ml-1 h-6 w-6 fill-current" /></span></span>
                <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold text-white">Aperçu vidéo</span>
              </button>
              <div className="p-4 sm:p-5">
                <h2 className="font-extrabold leading-snug text-slate-800">{video.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">{video.description}</p>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400"><span>Publié par {video.author}</span><button type="button" onClick={() => setSelectedVideo(video)} className="font-bold text-rose-600 hover:underline">Lire dans l’application</button></div>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedVideo && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedVideo(null); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="video-dialog-title" className="w-full max-w-4xl overflow-hidden rounded-3xl bg-slate-950 shadow-2xl">
          <header className="flex items-center justify-between gap-3 bg-white px-4 py-3 sm:px-5"><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Lecture vidéo</p><h2 id="video-dialog-title" className="truncate text-sm font-extrabold text-slate-800 sm:text-base">{selectedVideo.title}</h2></div><button type="button" onClick={() => setSelectedVideo(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800" aria-label="Fermer le lecteur"><X className="h-5 w-5" /></button></header>
          <div className="aspect-video w-full bg-black">{isDirectVideo(selectedVideo.url) ? <video src={selectedVideo.url} controls autoPlay className="h-full w-full" /> : <iframe src={getVideoPlayerUrl(selectedVideo.url)} title={selectedVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="h-full w-full border-0" />}</div>
          <p className="bg-white px-4 py-3 text-xs leading-relaxed text-slate-500 sm:px-5">{selectedVideo.description}</p>
        </section>
      </div>}
    </div>
  );
};
