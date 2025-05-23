"use client";

import Image from "next/image";
import { toastUtils, showApiError, showSaveSuccess } from '@/utils/toast';

const testToast = () => {

  // Utilisation basique
  toastUtils.info("Information importante");
  toastUtils.success("Opération réussie !");
  toastUtils.warn("Attention à ceci");
  toastUtils.error("Une erreur est survenue");

  // Toast de chargement
  const loadingToast = toastUtils.loading("Sauvegarde en cours...");
  // Plus tard...
  toastUtils.updateLoadingToSuccess(loadingToast, "Sauvegardé avec succès !");

  // Gestion automatique des promesses
  toastUtils.promise(
    fetch('/api/data'),
    {
      pending: 'Chargement des données...',
      success: 'Données chargées !',
      error: 'Erreur lors du chargement'
    }
  );

  // Fonctions utilitaires
  showApiError("truc muche erreur");
  showSaveSuccess("utilisateur");
}

export default function Home() {
  return (
    <div>
      <button className="bg-blue-500 text-white p-2 rounded-md" onClick={testToast}>Test Toast</button>
    </div>
  );
}
