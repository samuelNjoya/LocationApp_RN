import * as Yup from "yup";

// Validation avec Yup et ajout de la validation images
export const propretyHomeValidation = Yup.object().shape({
  title: Yup.string().required('Le titre est obligatoire'),
  price: Yup.number().positive('Doit être positif').required('Le prix est obligatoire'),
  description: Yup.string().required('La description est obligatoire'),
  location: Yup.string().required('La localisation est obligatoire'),
  bedrooms: Yup.number().min(0).required('Nombre de chambres requis'),
  bathrooms: Yup.number().min(0).required('Nombre de salles de bain requis'),
  images: Yup.array().min(1, 'Au moins une image est requise'),
});