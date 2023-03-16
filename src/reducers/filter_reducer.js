import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
  // products (filtered and all)
  if (action.type === LOAD_PRODUCTS) {
    let maxPrice = action.payload.map((p) => p.price);
    maxPrice = Math.max(...maxPrice);
    return {
      ...state,
      allProducts: [...action.payload],
      filteredProducts: [...action.payload],
      filters: { ...state.filters, price: maxPrice, maxPrice },
    };
  }

  // grid and list view reducers
  if (action.type === SET_GRIDVIEW) {
    return { ...state, gridView: true };
  }
  if (action.type === SET_LISTVIEW) {
    return { ...state, gridView: false };
  }

  // sort reducer
  if (action.type === UPDATE_SORT) {
    return { ...state, sort: action.payload.value };
  }
  if (action.type === SORT_PRODUCTS) {
    const { sort, filteredProducts } = state;
    let tempProducts = [...filteredProducts];
    if (sort === "price-lowest") {
      tempProducts = tempProducts.sort((a, b) => a.price - b.price);
    }
    if (sort === "price-highest") {
      tempProducts = tempProducts.sort((a, b) => b.price - a.price);
    }
    if (sort === "name-a") {
      tempProducts = tempProducts.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }
    if (sort === "name-z") {
      tempProducts = tempProducts.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    }
    return { ...state, filteredProducts: tempProducts };
  }

  // filter reducers
  if (action.type === UPDATE_FILTERS) {
    const { name, value } = action.payload;
    return { ...state, filters: { ...state.filters, [name]: value } };
  }
  if (action.type === FILTER_PRODUCTS) {
    const { allProducts } = state;
    const { text, price, company, color, category, shipping } = state.filters;
    let tempProducts = [...allProducts];
    // filtering
    // text
    if (text) {
      tempProducts = tempProducts.filter((product) =>
        product.name.toLowerCase().includes(text)
      );
    }
    // category
    if (category !== "all") {
      tempProducts = tempProducts.filter(
        (product) => product.category === category
      );
    }
    // company
    if (company !== "all") {
      tempProducts = tempProducts.filter(
        (product) => product.company === company
      );
    }

    // colors
    if (color !== "all") {
      tempProducts = tempProducts.filter((product) => {
        return product.colors.find((c) => color === c);
      });
    }

    // price
    tempProducts = tempProducts.filter((product) => {
      return product.price <= price;
    });

    // shipping
    if (shipping) {
      tempProducts = tempProducts.filter(
        (product) => product.shipping === true
      );
    }

    return { ...state, filteredProducts: tempProducts };
  }
  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      filters: {
        ...state.filters,
        text: "",
        company: "all",
        category: "all",
        color: "all",
        price: state.filters.maxPrice,
        shipping: false,
      },
    };
  }

  throw new Error(`No Matching "${action.type}" - action type`);
};

export default filter_reducer;
