import ICountry from './ICountry';

export default interface IProductionCompany {
    name: string;
    id: number;
    logo_path: string | null;
    origin_country: string;
}
