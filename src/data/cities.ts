export type City = {
  slug: string;
  name: string;
  region: string;
  population: number;
};

export const cities: City[] = [
  { slug: "toshkent", name: "Toshkent", region: "Toshkent shahri", population: 2900000 },
  { slug: "samarqand", name: "Samarqand", region: "Samarqand viloyati", population: 550000 },
  { slug: "namangan", name: "Namangan", region: "Namangan viloyati", population: 626000 },
  { slug: "andijon", name: "Andijon", region: "Andijon viloyati", population: 447000 },
  { slug: "buxoro", name: "Buxoro", region: "Buxoro viloyati", population: 280000 },
  { slug: "fargona", name: "Farg'ona", region: "Farg'ona viloyati", population: 320000 },
  { slug: "qarshi", name: "Qarshi", region: "Qashqadaryo viloyati", population: 270000 },
  { slug: "nukus", name: "Nukus", region: "Qoraqalpog'iston", population: 320000 },
  { slug: "urganch", name: "Urganch", region: "Xorazm viloyati", population: 175000 },
  { slug: "termiz", name: "Termiz", region: "Surxondaryo viloyati", population: 180000 },
  { slug: "navoiy", name: "Navoiy", region: "Navoiy viloyati", population: 145000 },
  { slug: "jizzax", name: "Jizzax", region: "Jizzax viloyati", population: 180000 },
];

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
