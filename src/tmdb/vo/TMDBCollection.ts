export default interface TMDBCollection<Item> {
    page: number;
    results: Array<Item>;
    total_pages: number;
    total_results: number;
}
