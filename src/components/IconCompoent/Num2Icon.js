import React from 'react';
import Icon from "@ant-design/icons";

const Icon2 = () => (
  <svg t="1593492065661"
       className="icon"
       viewBox="0 0 1024 1024"
       version="1.1"
       xmlns="http://www.w3.org/2000/svg" p-id="1438"
       width='1em' height='1em'>
    <path
      d="M512 899.5c-213.668 0-387.5-173.832-387.5-387.5S298.332 124.5 512 124.5 899.5 298.332 899.5 512 725.668 899.5 512 899.5z"
      fill="#4472C4" p-id="1439"/>
    <path
      d="M512 137c-206.776 0-375 168.224-375 375s168.224 375 375 375 375-168.224 375-375-168.224-375-375-375m0-25c220.914 0 400 179.086 400 400S732.914 912 512 912 112 732.914 112 512s179.086-400 400-400z"
      fill="#4472C4" p-id="1440"/>
    <path
      d="M658.94 684.941c0-8.235-2.941-15.294-8.235-22.353S639.529 652 632.471 652a64.116 64.116 0 0 0-15.294 1.765l-8.235 1.765-8.235 1.176c-12.941 1.176-25.882 2.353-39.412 2.353-14.118 0-27.059 0.588-39.412 1.176-11.765 1.176-24.118 1.765-37.059 2.353-12.941 1.176-29.412 2.353-48.824 4.706 13.529-11.176 24.706-21.176 33.529-29.412l24.118-22.941 39.412-38.235c12.941-12.941 25.881-25.294 39.412-38.235a170.839 170.839 0 0 0 38.235-57.059 184.229 184.229 0 0 0 12.353-67.647c0-12.353-2.941-24.706-8.235-37.059a138.277 138.277 0 0 0-22.941-32.941 121.843 121.843 0 0 0-35.294-22.941A108.656 108.656 0 0 0 513.06 312a180.13 180.13 0 0 0-50 7.059 125.575 125.575 0 0 0-44.12 24.706c-4.706 3.529-8.824 8.824-13.529 14.706-4.706 6.471-9.412 12.941-12.941 20a114.8 114.8 0 0 0-10 21.176 49.641 49.641 0 0 0-4.118 18.824c0 7.059 2.353 12.353 8.235 17.059 5.294 5.294 10.588 7.647 16.471 7.647 4.118 0 7.647-0.588 10.588-2.941a98.088 98.088 0 0 0 8.824-8.235 80.559 80.559 0 0 0 4.706-8.235c1.765-2.941 3.529-6.471 5.294-10 1.176-2.941 2.941-6.471 4.118-10a38.4 38.4 0 0 1 4.706-10c8.235-14.118 17.647-24.706 28.235-32.941 10-7.647 24.118-11.765 41.765-11.765a69.788 69.788 0 0 1 27.059 5.882 82.831 82.831 0 0 1 21.765 15.882 92.786 92.786 0 0 1 14.122 22.941 71.518 71.518 0 0 1 5.294 27.059 95.714 95.714 0 0 1-5.294 32.352A143.025 143.025 0 0 1 561.294 482a160.888 160.888 0 0 1-17.647 25.294c-7.059 8.235-14.706 15.882-21.765 22.941L466 582.588c-18.235 17.647-37.647 34.118-57.647 50a178.261 178.261 0 0 0-15.294 13.53c-4.706 4.706-8.824 9.412-13.529 14.118a82.159 82.159 0 0 0-10 11.765 31.891 31.891 0 0 0-3.529 14.706c0 8.235 2.941 14.706 9.412 18.824 5.882 4.706 12.353 6.471 20 6.471a81.789 81.789 0 0 0 15.882-1.765l8.824-1.765c2.353-0.588 5.294-1.176 8.235-1.765 22.353-2.941 45.294-5.294 69.412-7.647q35.294-3.529 68.824-3.529a286.194 286.194 0 0 1 38.235 2.941c12.353 2.353 24.706 2.941 37.647 2.941 3.529 0 7.059-1.176 10.588-4.706a13.693 13.693 0 0 0 5.88-11.766z"
      fill="#FFFFFF" p-id="1441"/>
  </svg>);

const Num2Icon = (props) => {
    console.log(props);
    // const numFillColor = selected ? "#FFFFFF" : selectedColor;
    // const fillColor = selected ? selectedColor : "#FFFFFF";
    const numFillColor = "#FFFFFF";
    const fillColor = "#4472C4";
    const selectedColor = "#4472C4";
    return (
      <Icon component={Icon2} {...props}/>
    )
};

export default Num2Icon;
