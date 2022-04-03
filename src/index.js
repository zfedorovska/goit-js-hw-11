import './css/styles.css';
import Notiflix from 'notiflix';
import ImagesApiService from './js/images-api-service';
import LoadMoreBtn from './js/load-more'
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery')
}

const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '.load-more',
    hidden: true
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);

function onSearch(e) {
    e.preventDefault();

    clearImagesContainer();
    imagesApiService.searchQuery = e.currentTarget.elements.searchQuery.value;
    imagesApiService.resetPage();
    fetchImages(); 
}

function fetchImages() {
    loadMoreBtn.hide();
    let page = imagesApiService.page;
    imagesApiService.fetchImages().then(images => {
        let imgCount = document.querySelectorAll('.photo-card').length + 40;
        if (page===1 && images.hits.length === 0)
        {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
        }
        if (page>1 && imgCount>images.totalHits)       {
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
            return;
        }
        if (page === 1) {
            Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
        }
        appendImagesMarkup(images.hits);
        loadMoreBtn.show();
    })
}

function appendImagesMarkup(images) {
     const makeImages = images
        .map(makeImageMarkup)
        .join('');
    refs.gallery.insertAdjacentHTML('beforeend', makeImages);
        const lightbox = new SimpleLightbox('.gallery a');
    lightbox.on('show.simplelightbox');
}

function clearImagesContainer() {
    refs.gallery.innerHTML = '';
}

const makeImageMarkup = image => {
    return `
    <a class="gallery__item" href=${image.largeImageURL }>
      <div class="photo-card">     
        <img class="gallery__image" src=${image.webformatURL} alt="${image.tags}" loading="lazy" />       
            <div class="info">
                <p class="info-item">
                <b>Likes</b></br>${image.likes}
                </p>
                <p class="info-item">
                <b>Views</b></br>${image.views}
                </p>
                <p class="info-item">
                <b>Comments</b></br>${image.comments}
                </p>
                <p class="info-item">
                <b>Downloads</b></br>${image.downloads}
                </p>
            </div>
        </div>
    </a>`
};


