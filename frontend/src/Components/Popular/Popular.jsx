import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from '../Item/Item';

const Popular = () => {
  const [popularItems, setPopularItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/popularinwomen')
      .then((response) => response.json())
      .then((data) => setPopularItems(data))
      .catch((error) => console.error('Error fetching popular items:', error));
  }, []);

  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr/>
      <div className="popular-item">
        {popularItems.map((item, i) => (
          <Item key={i} id={item.id} name={item.name} img={item.image} new_price={item.new_price} old_price={item.old_price}/>
        ))}
      </div>
    </div>
  );
};

export default Popular;
