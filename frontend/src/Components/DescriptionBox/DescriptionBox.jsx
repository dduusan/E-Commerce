import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description </div>
            <div className="descriptionbox-nav-box fade">Reviews (122) </div>
        </div>
        <div className="descriptionbox-description">
            <p>
                    Sustainable Fashion
                    We are committed to sustainability. Our clothing is made from eco-friendly materials, 
                    and we strive to reduce our environmental impact through ethical manufacturing practices.
            </p>
            <p>
            E-commerce, short for electronic commerce, refers to the buying and selling of goods or services
             using the internet, as well as the transfer of money and data to execute these transactions. It 
             encompasses a wide range of online business activities for products and services
            </p>
        </div>
    </div>
  )
}

export default DescriptionBox