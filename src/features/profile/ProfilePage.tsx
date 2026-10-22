import React, { useRef, useState } from 'react';
import { Camera, Mail, Save, Trash2, UserRound } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

const resizeImage = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    const maxSize = 480;
    const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    const context = canvas.getContext('2d');
    if (!context) {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Impossible de lire cette image.'));
      return;
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(objectUrl);
    resolve(canvas.toDataURL('image/jpeg', 0.78));
  };
  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    reject(new Error('Le fichier sélectionné ne peut pas être utilisé comme photo.'));
  };
  image.src = objectUrl;
});

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const fileInput = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const handlePhoto = async (file?: File) => {
    if (!file) return;
    setError('');
    try {
      setPhotoURL(await resizeImage(file));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Impossible de charger cette photo.');
    }
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (!displayName.trim()) {
      setError('Renseignez votre nom affiché.');
      return;
    }
    updateProfile({ displayName: displayName.trim(), photoURL: photoURL || null });
    setNotice('Votre profil a été enregistré. La photo est maintenant visible dans l’annuaire.');
    setError('');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <header>
        <div className="flex items-center gap-2 text-[#139BD7]"><UserRound className="h-6 w-6" /><span className="text-xs font-bold uppercase tracking-[0.16em]">Espace personnel</span></div>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">Mon profil</h1>
        <p className="mt-1 text-sm text-slate-500">Mettez à jour votre nom affiché et votre photo de profil.</p>
      </header>

      <form onSubmit={handleSave} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center gap-4 bg-gradient-to-r from-sky-50 to-indigo-50 p-6 sm:flex-row sm:p-8">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-sky-100 text-3xl font-extrabold text-sky-700 shadow-md">
              {photoURL ? <img src={photoURL} alt="Photo de profil" className="h-full w-full object-cover" /> : displayName.charAt(0).toUpperCase() || <UserRound className="h-9 w-9" />}
            </div>
            <button type="button" onClick={() => fileInput.current?.click()} className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#139BD7] text-white shadow hover:bg-sky-700" aria-label="Choisir une photo"><Camera className="h-4 w-4" /></button>
            <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={(event) => handlePhoto(event.target.files?.[0])} />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-extrabold text-slate-800">Votre photo de profil</h2>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500">Choisissez une image JPG, PNG ou WebP. Elle sera redimensionnée et utilisée pour vous identifier dans l’annuaire.</p>
            {photoURL && <button type="button" onClick={() => setPhotoURL('')} className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:underline"><Trash2 className="h-3.5 w-3.5" />Retirer la photo</button>}
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-8">
          {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}
          {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
          <label className="block space-y-1.5"><span className="text-xs font-bold text-slate-600">Nom affiché</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100" /></label>
          <div className="block space-y-1.5"><span className="text-xs font-bold text-slate-600">Adresse e-mail</span><div className="flex h-11 items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3.5 text-sm text-slate-500"><Mail className="h-4 w-4" />{user?.email || '—'}</div></div>
          <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1.5"><span className="text-xs font-bold text-slate-600">Direction</span><p className="rounded-xl bg-slate-50 px-3.5 py-3 text-sm text-slate-600">{user?.department || 'Collaborateur ADEC'}</p></div><div className="space-y-1.5"><span className="text-xs font-bold text-slate-600">Rôle</span><p className="rounded-xl bg-slate-50 px-3.5 py-3 text-sm text-slate-600">{user?.role || 'Collaborateur'}</p></div></div>
          <div className="flex justify-end border-t border-slate-100 pt-4"><button type="submit" className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#139BD7] px-5 text-sm font-bold text-white shadow-sm hover:bg-sky-700"><Save className="h-4 w-4" />Enregistrer le profil</button></div>
        </div>
      </form>
    </div>
  );
};
