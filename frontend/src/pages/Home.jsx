import { useEffect, useState } from "react";
import "../styles/home.scss";
import { getToken } from "../store/slices/authSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import printVarsHook from "../components/printVarsHook";
import { CogIcon, TriangleIcon } from "../components/icons/Icons";
import { useSocket } from "../utils/PrivateRoutes";
import { initialiseUser, selectUser } from "../store/slices/userSlice";
import { Autocomplete, Slider, TextField, Tooltip } from "@mui/material";
import UserCard from "../components/UserCard";
import SearchSchema from "../schemas/SearchSchema";
import { useFormik } from "formik";
import TagEnum from "../Enum/TagEnum";
import { useNavigate } from "react-router-dom";
import {
  editBlockUser,
  editConcernUser,
  selectAllModals,
} from "../store/slices/modalSlice";

const Home = () => {
  const [allUsers, setAllUsers] = useState(null);
  const me = useSelector(selectUser);
  const token = useSelector(getToken);
  const dispatch = useDispatch();
  const socket = useSocket();
  const allModals = useSelector(selectAllModals);
  const navigate = useNavigate();
  const [openSearchParm, setOpenSearchParm] = useState(false);

  const getAllUsers = () => {
    axios
      .get("http://localhost:8000/users/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token}`,
        },
      })
      .then(({ data }) => {
        setAllUsers(data.filter((user) => user.id != me.id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const navOtherProfil = (user) => () => {
    navigate("/profil/see", {
      state: user,
    });
  };

  const onSearch = (value) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    };
    axios
      .post(`http://localhost:8000/users/search`, value, {
        headers: headers,
      })
      .then(({ data }) => {
        console.log(data);
        console.log(value);
        setAllUsers(data);
      });
  };

  const onLikeUser = (user_id) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    };
    axios
      .post(
        `http://localhost:8000/users/like/${user_id}`,
        {},
        {
          headers: headers,
        }
      )
      .then(({ data }) => {
        dispatch(initialiseUser(data));
        onSearch(searchFormik.values);
      });
  };

  const onBlockUser = (user) => {
    dispatch(editBlockUser(allModals.blockUser));
    dispatch(editConcernUser(user));
  };

  const onUpdateStatus = ({ user_id, status }) => {
    if (user_id != me.id) searchFormik.submitForm();
  };

  useEffect(() => {
    if (socket) socket.on("update-status", onUpdateStatus);

    return () => {
      if (socket) socket.off("update-status", onUpdateStatus);
    };
  }, [socket]);

  const searchFormik = useFormik({
    validationSchema: SearchSchema(),
    initialValues: {},
    onSubmit: (values) => onSearch(values),
  });

  useEffect(() => {
    const id = setTimeout(() => {
      if (Object.keys(searchFormik.values).length) {
        searchFormik.submitForm();
      }
    }, 1500);
    return () => clearTimeout(id);
  }, [searchFormik.values]);

  printVarsHook(allUsers, "allUsers");
  printVarsHook(searchFormik.values, "searchFormik.values");
  printVarsHook(searchFormik.errors, "searchFormik.errors");

  return (
    <div className="main">
      <form className="search-container" onSubmit={searchFormik.onSubmit}>
        <div className="title-container">
          <div className="title">Search an user</div>
          <div className="icons">
            <div className="container">
              <Tooltip disableHoverListener={me.photos.find(photo => photo.main)} title='You must set a main profile pic to search users.'>

              <div
                className={"icon " + (!me.photos.find(photo => photo.main) ? "disabled" : "")}
                onClick={() => !!me.photos.find(photo => photo.main) && setOpenSearchParm((prev) => !prev)}
                >
                <CogIcon />
              </div>
                </Tooltip>
              <div
                className={"sub-icon " + (openSearchParm ? "open" : "close")}
              >
                <TriangleIcon />
              </div>
            </div>
          </div>
        </div>
        <div
          className={"param-container " + (openSearchParm ? "open" : "close")}
        >
          <div className="item">
            <div className="title">Age Limit</div>
            <input
              type="checkbox"
              value={Object.keys(searchFormik.values).includes("age_limit")}
              onChange={() =>
                searchFormik.setFieldValue(
                  "age_limit",
                  Object.keys(searchFormik.values).includes("age_limit")
                    ? undefined
                    : { min: 18, max: 25 }
                )
              }
            />
            <Slider
              min={18}
              max={99}
              disabled={!Object.keys(searchFormik.values).includes("age_limit")}
              value={
                Object.keys(searchFormik.values).includes("age_limit")
                  ? [
                      searchFormik.values.age_limit.min,
                      searchFormik.values.age_limit.max,
                    ]
                  : 0
              }
              onChange={(e) =>
                Object.keys(searchFormik.values).includes("age_limit") &&
                searchFormik.setFieldValue("age_limit", {
                  min: e.target.value[0],
                  max: e.target.value[1],
                })
              }
              valueLabelDisplay="auto"
            />
          </div>
          <div className="item">
            <div className="title">Fame Limit</div>
            <input
              type="checkbox"
              value={Object.keys(searchFormik.values).includes(
                "fame_rate_limit"
              )}
              onChange={() =>
                searchFormik.setFieldValue(
                  "fame_rate_limit",
                  Object.keys(searchFormik.values).includes("fame_rate_limit")
                    ? undefined
                    : { min: 0, max: 128 }
                )
              }
            />
            <Slider
              min={0}
              max={999}
              disabled={
                !Object.keys(searchFormik.values).includes("fame_rate_limit")
              }
              value={
                Object.keys(searchFormik.values).includes("fame_rate_limit")
                  ? [
                      searchFormik.values.fame_rate_limit.min,
                      searchFormik.values.fame_rate_limit.max,
                    ]
                  : 0
              }
              onChange={(e) =>
                Object.keys(searchFormik.values).includes("fame_rate_limit") &&
                searchFormik.setFieldValue("fame_rate_limit", {
                  min: e.target.value[0],
                  max: e.target.value[1],
                })
              }
              valueLabelDisplay="auto"
            />
          </div>
          <div className="item">
            <div className="title">{"Location Limit (m)"}</div>
            <input
              type="checkbox"
              value={Object.keys(searchFormik.values).includes(
                "location_limit"
              )}
              onChange={() =>
                searchFormik.setFieldValue(
                  "location_limit",
                  Object.keys(searchFormik.values).includes("location_limit")
                    ? undefined
                    : { min: 0, max: 50 }
                )
              }
            />
            <Slider
              min={0}
              max={500}
              disabled={
                !Object.keys(searchFormik.values).includes("location_limit")
              }
              value={
                Object.keys(searchFormik.values).includes("location_limit")
                  ? [
                      searchFormik.values.location_limit.min,
                      searchFormik.values.location_limit.max,
                    ]
                  : 0
              }
              onChange={(e) =>
                Object.keys(searchFormik.values).includes("location_limit") &&
                searchFormik.setFieldValue("location_limit", {
                  min: e.target.value[0],
                  max: e.target.value[1],
                })
              }
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => (value == 500 ? "∞" : value)}
            />
          </div>
          <div className="item">
            <Autocomplete
              multiple
              className="input"
              id="tags-outlined"
              options={Object.keys(TagEnum)}
              filterSelectedOptions
              disableCloseOnSelect
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search by tags"
                  // placeholder="Favorites"
                />
              )}
              selectOnFocus
              onChange={(e, value) =>
                searchFormik.setFieldValue(
                  "tags",
                  value.length ? value : undefined
                )
              }
            />
          </div>
        {!Object.keys(searchFormik.values).length &&
          searchFormik.isSubmitting && (
            <div className="error">Need at least one param.</div>
          )}
        </div>
      </form>
      {allUsers && allUsers.length <= 0 ? (
        <div> </div>
      ) : (
        <div className="searchResult">
          {allUsers && <h3> Result of your research</h3>}
          <div className="resultCardContainer">
            {allUsers &&
              allUsers.map((user, index) => (
                <UserCard
                  me={me}
                  user={user}
                  key={user.id}
                  onLikeUser={onLikeUser}
                  onBlockUser={onBlockUser}
                />
              ))}
          </div>
        </div>
      )}
      {!allUsers && <h3 className="launchSearch"> Find your soul mate !</h3>}
      {allUsers && allUsers.length <= 0 && (
        <div  className="findNothing">
          <h3>
            {" "}
            The search didn&apos;t produce any results, please broaden your
            criteria ❤{" "}
          </h3>
        </div>
      )}
    </div>
  );
};

export default Home;
