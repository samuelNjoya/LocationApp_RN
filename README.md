<!-- pour installer le toast notification Toujours envelopper dans App.js pour un contrôle global de l'application -->
npx expo install react-native-toast-notifications
<!-- pour eviter le dobordement des element du telephone -->
npx expo install react-native-safe-area-context


<!-- Native Base important -->
dans plays store telecharger l'application Acheter-louer Achat-location 


<!-- Autres idées importantes  -->
1- Possibilité de partager une annonce par les media
2-internationnalisation react-native-localize détecte la langue du téléphone automatiquement. i18next
 service de gestion de contenu multilingue Lokalise, Crowdin, Phrase, Transifex


rmdir /s /q node_modules
del package-lock.json

rmdir /s /q node_modules && del package-lock.json
 supprime le node_module et package json et npm install pour encore tout installer

 npm cache clean --force 
 npm install --legacy-peer-deps

un petit script .bat (fichier Windows) que tu pourras lancer à chaque fois pour faire ce nettoyage automatique ? interressant