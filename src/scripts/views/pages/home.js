import Card from '../components/card';
import SectionNavigateLink from '../components/section-navigate-link';
import HeroImage from '../components/hero-image';
import RestaurantSource from '../../data/restaurant-source';
import FavoriteRestaurantIdb from '../../data/favorite-restaurant-idb';
import OfflineConnectionHandler from '../../utils/offline-connection-handler';
import CardSkeletonInitiator from '../../utils/card-skeleton-initiator';
import HeaderTitleInitiator from '../../utils/header-title-initiator';
import NavActiveHandler from '../../utils/nav-active-handler';
import EmptyLikedIndicator from '../components/empty-liked-indicator';

const Home = {
  async render() {
    return `
      <div class="home-wrapper">
        <section class="hero-wrapper"></section>
        <section class="restaurant-section">
          <div class="restaurant-link-container"></div>
          <section class="restaurant-list"></section>
          <div class="offline-indicator-container"></div>
        </section>     
        <section class="restaurant-section home-fav-section">
          <div class="favorite-link-container"></div>
          <section class="restaurant-list home-fav-list"></section>
        </section>
      </div>
    `;
  },

  async afterRender() {
    this.renderHeroImage();
    HeaderTitleInitiator.init('Home');
    NavActiveHandler.toggleActiveNav(1);
    this.renderSectionLink();

    const restaurantListContainer = document.querySelector('.restaurant-list');
    const favoriteListContainer = document.querySelector('.home-fav-list');
    CardSkeletonInitiator.initHome(restaurantListContainer, favoriteListContainer);

    try {
      const restaurants = await RestaurantSource.getRestaurantList();
      this.renderRestaurantList(restaurantListContainer, restaurants);
    } catch (error) {
      const offlineContainer = document.querySelector('.offline-indicator-container');
      offlineContainer.innerHTML = OfflineConnectionHandler.init();
    }

    const favorites = await FavoriteRestaurantIdb.getAllRestaurants();
    this.isFavoriteListEmpty(favorites, favoriteListContainer);
  },

  renderHeroImage() {
    const heroImageContainer = document.querySelector('.hero-wrapper');
    heroImageContainer.innerHTML = HeroImage.render();
  },

  isFavoriteListEmpty(favorites, favoriteListContainer) {
    if (favorites.length === 0) {
      this.renderEmptyFavoriteList(favoriteListContainer);
    } else {
      this.renderRestaurantList(favoriteListContainer, favorites);
    }
  },

  renderRestaurantList(restaurantListContainer, restaurants) {
    const html = restaurants
      .slice(0, 10)
      .reduce((accumulator, restaurant) => accumulator + Card.render(restaurant), '');
    restaurantListContainer.innerHTML = html;
  },

  renderEmptyFavoriteList(favoriteListContainer) {
    favoriteListContainer.innerHTML = EmptyLikedIndicator.render();
  },

  renderSectionLink() {
    const restaurantLinkContainer = document.querySelector('.restaurant-link-container');
    const favoriteLinkContainer = document.querySelector('.favorite-link-container');
    restaurantLinkContainer.innerHTML = SectionNavigateLink.render('Restaurant Catalogue', '#/restaurants');
    favoriteLinkContainer.innerHTML = SectionNavigateLink.render('Liked Restaurant', '#/liked-restaurants');
  },
};

export default Home;