import React, { useContext } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";
import dropdrown_icon from "../Components/Assets/dropdown_icon.png";
import Item from "../Components/Item/Item";

export const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);

  const products = () => {
    all_product.map((item, i) => {
      if (props.category === item.category) {
        return (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            img={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        );
      }

      return null;
    });
  };

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1 of 12</span> out of 36 products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdrown_icon} alt="" />
        </div>
      </div>
      <div className="shopcategory-products">{products()}</div>
      <div className="shopcategory-loadmore">Explore more</div>
    </div>
  );
};

export default ShopCategory;
