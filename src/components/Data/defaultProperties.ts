
export interface PropertyHome {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  location: string;
  bedrooms: number;
  bathrooms: number;
  owner: string;
}


const defaultProperties = [
    {
        id: 1,
        title: 'Appartement moderne dans Yaoundé',
        price: 35000000,
        description: 'Bel appartement avec 3 chambres, proche du centre-ville, idéal pour famille.',
        images: [
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        ],
        location: 'Yaoundé',
        bedrooms: 3,
        bathrooms: 2,
        owner: 'Alice',
    },
    {
        id: 2,
        title: 'Villa spacieuse à Douala',
        price: 120000000,
        description: 'Villa avec jardin, 5 chambres, quartier sécurisé, proche écoles et commerces.',
        images: [
            'https://images.unsplash.com/photo-1710883727450-d3a0ab1bbbe3?q=80&w=1163&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ],
        location: 'Douala',
        bedrooms: 5,
        bathrooms: 4,
        owner: 'Bob',
    },
    {
        id: 3,
        title: 'Villa spacieuse à Kribi',
        price: 140500000,
        description: 'Villa avec jardin, 5 chambres, quartier sécurisé, proche écoles et commerces.',
        images: [
            'https://images.unsplash.com/photo-1710883734891-93709398496d?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ],
        location: 'Kribi',
        bedrooms: 5,
        bathrooms: 4,
        owner: 'Bob',
    },
    {
        id: 4,
        title: 'Villa spacieuse à Kribi',
        price: 140500000,
        description: 'Villa avec jardin, 5 chambres, quartier sécurisé, proche écoles et commerces.',
        images: [
            'https://images.unsplash.com/photo-1638369022547-1c763b1b9b3b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ],
        location: 'Kribi',
        bedrooms: 5,
        bathrooms: 4,
        owner: 'Bob',
    },
    {
        id: 5,
        title: 'Villa spacieuse à Kribi',
        price: 140500000,
        description: 'Villa avec jardin, 5 chambres, quartier sécurisé, proche écoles et commerces.',
        images: [
            'https://images.unsplash.com/photo-1615127039501-bdcc95f61c63?q=80&w=753&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        ],
        location: 'Kribi',
        bedrooms: 5,
        bathrooms: 4,
        owner: 'Bob',
    },
    {
        id: 6,
        title: 'Villa spacieuse à Kribi',
        price: 140500000,
        description: 'Villa avec jardin, 5 chambres, quartier sécurisé, proche écoles et commerces.',
        images: [
            'https://images.unsplash.com/photo-1603384596556-78e66c81c91b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        ],
        location: 'Kribi',
        bedrooms: 5,
        bathrooms: 4,
        owner: 'Bob',
    },
    // ... (tes autres propriétés)
];

export default defaultProperties;
