import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { DataContext } from "../store/GlobalState";
import { postData, putData } from "../utils/fetchData";
import { updateItem } from "../store/Actions";

const Categories = () => {
  const { state, dispatch } = useContext(DataContext);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const { categories, auth } = state;

  const createCategory = async () => {
    if (auth.user.role !== "admin")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Xác thực không hợp lệ!" },
      });
    if (!name)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Tên không được để trống" },
      });
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    let res;
    if (id) {
      res = await putData(`categories/${id}`, { name }, auth.token);
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      dispatch(updateItem(categories, id, res.category, "ADD_CATEGORIES"));
    } else {
      res = await postData("categories", { name }, auth.token);
      if (res.err)
        return dispatch({
          type: "NOTIFY",
          payload: { error: res.err },
        });
      dispatch({
        type: "ADD_CATEGORIES",
        payload: [...categories, res.newCategory],
      });
    }

    setName("");
    setId("");

    return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };

  const handleEditCategory = (category) => {
    setName(category.name);
    setId(category._id);
  };
  return (
    <div className="col-md-6 mx-auto my-3">
      <Head>
        <title>Danh mục</title>
      </Head>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Tên danh mục"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="btn btn-secondary ml-1" onClick={createCategory}>
          {id ? "Update" : "Create"}
        </button>
      </div>
      {categories.map((category) => (
        <div key={category._id} className="card my-2 text-capitalize">
          <div className="card-body d-flex justify-content-between">
            {category.name}
            <div style={{ cursor: "pointer" }}>
              <i
                className="fas fa-edit mr-2 text-info"
                aria-hidden="true"
                onClick={() => handleEditCategory(category)}
              ></i>
              <i
                className="fas fa-trash text-danger"
                aria-hidden="true"
                data-toggle="modal"
                data-target="#exampleModal"
                onClick={() =>
                  dispatch({
                    type: "ADD_MODAL",
                    payload: [
                      {
                        data: categories,
                        id: category._id,
                        title: category.name,
                        type: "ADD_CATEGORIES",
                      },
                    ],
                  })
                }
              ></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;
