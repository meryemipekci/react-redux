import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { createDataFunc, updateDataFunc } from "../redux/dataSlice";
import { modalFunc } from "../redux/modalSlice";
import { useLocation } from "react-router-dom";

const Product = () => {
  const { modal } = useSelector((state) => state.modal);
  const { data, keyword } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const location = useLocation();
  const [productInfo, setProductInfo] = useState({
    name: "",
    price: "",
    url: "",
  });
  console.log(productInfo);
  const onChangeFunc = (e, type) => {
    if (e.target) {
      if (type === "url" && e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductInfo((prev) => ({
            ...prev,
            [e.target.name]: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setProductInfo((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      }
    }
  };

  let loc = location?.search.split("=")[1];
  useEffect(() => {
    if (loc) {
      setProductInfo(data.find((dt) => dt.id == loc));
    }
  }, [loc]);

  console.log(location?.search.split("=")[1], "location");

  const buttonFunc = () => {
    dispatch(createDataFunc({ ...productInfo, id: data.length + 1 }));
    dispatch(modalFunc());
  };

  const buttonUpdateFunc = () => {
    dispatch(updateDataFunc({ ...productInfo, id: loc }));
    dispatch(modalFunc());
  };
  const contentModal = (
    <>
      <Input
        value={productInfo.name}
        type={"text"}
        placeholder={"Urun ekle"}
        name={"name"}
        id={"name"}
        onChange={(e) => onChangeFunc(e, "name")}
      />
      <Input
        value={productInfo.price}
        type={"text"}
        placeholder={"Fiyat ekle"}
        name={"price"}
        id={"price"}
        onChange={(e) => onChangeFunc(e, "price")}
      />
      <Input
        type={"file"}
        placeholder={"Resim sec"}
        name={"url"}
        id={"url"}
        onChange={(e) => onChangeFunc(e, "file")}
      />
      <Button
        btnText={loc ? "urun guncelle" : "urun olustur"}
        onClick={loc ? buttonUpdateFunc : buttonFunc}
      />
    </>
  );
  const filteredItems = data.filter((dt) =>
    dt.name.toLowerCase().includes(keyword)
  );
  return (
    <div>
      <div className="flex items-center flex-wrap">
        {filteredItems?.map((dt, i) => (
          <ProductCard key={i} dt={dt} />
        ))}
      </div>

      {modal && (
        <Modal
          content={contentModal}
          title={loc ? "urun guncelle" : "urun olustur"}
        />
      )}
    </div>
  );
};

export default Product;
