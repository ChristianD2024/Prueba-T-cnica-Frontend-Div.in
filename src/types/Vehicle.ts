   export interface Vehicle {
     id: number;
     make: string;
     model: string;
     year: number;
     class: string;
     fuel_type: string;
     transmission: string;
     city_mpg: string | number;
     highway_mpg: string | number;
     combination_mpg: string | number;
     latitude: number;
     longitude: number;
     cylinders?: number;
     displacement?: number;
     drive?: string;
   }
   