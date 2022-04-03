import axios from 'axios';

export default class ImagesApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
     }

    async fetchImages() {
        const API_KEY = '26451548-31afe824f4cddf17f2ad70b2c';
        const url = `https://pixabay.com/api/`;
        try {
            const imagesData = await axios.get(url, {
                params: {
                    key: API_KEY,
                    q: this.searchQuery,
                    image_type: 'photo',
                    orientation: true,
                    safesearch: true,
                    per_page: 40,
                    page: this.page
                }
            })
            this.page += 1;   
            return { hits: imagesData.data.hits, totalHits: imagesData.data.totalHits };
        }
        catch (error) {
            console.log(error.message);
        }          
    };
            
    resetPage() {
        this.page = 1;
    }  
}