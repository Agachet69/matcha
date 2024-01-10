import { useEffect, useState } from "react";
import "../styles/home.scss";

import { getToken } from "../store/slices/authSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import printVarsHook from "../components/printVarsHook";
import {
  UserIcon,
  Age,
  MaleIcon,
  FemaleIcon,
  HeartIcon,
  CrossIcon,
  CogIcon,
  TriangleIcon,
} from "../components/icons/Icons";
import GenderEnum from "../Enum/GenderEnum";
import { useSocket } from "../utils/PrivateRoutes";
import { initialiseUser, selectUser } from "../store/slices/userSlice";
import {
  Box,
  Chip,
  MenuItem,
  OutlinedInput,
  Slider,
  Tooltip,
} from "@mui/material";
import UserCard from "../components/UserCard";
import SearchSchema from "../schemas/SearchSchema";
import { useFormik } from "formik";
import Select from "react-select";
import SearchParamEnum from "../Enum/SearchParamEnum";
import { object } from "yup";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [allUsers, setAllUsers] = useState(Array());
  const me = useSelector(selectUser);
  const token = useSelector(getToken);
  const dispatch = useDispatch();
  const socket = useSocket();
  const navigate = useNavigate();

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

  const navOtherProfil = (user) => {
    navigate("/profil/" + user.id, {
      state: user
    })
  }

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
        setAllUsers(data);
      });
  };

  // useEffect(() => {
  //     getAllUsers()
  // }, [])

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

  const [openSearchParm, setOpenSearchParm] = useState(false);

  return (
    <div className="main">
      <form className="search-container" onSubmit={searchFormik.onSubmit}>
        <div className="title-container">
          <div className="title">Search Params</div>
          <div className="icons">
            <div className="container">
              <div
                className="icon"
                onClick={() => setOpenSearchParm((prev) => !prev)}
              >
                <CogIcon />
              </div>
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
            />
          </div>
        </div>
        {!Object.keys(searchFormik.values).length &&
          searchFormik.isSubmitting && (
            <div className="error">Need at least one param.</div>
          )}

        {allUsers.map((user, index) => (
          <UserCard
            me={me}
            user={user}
            key={user.id}
            onLikeUser={onLikeUser}
            onClick={navOtherProfil}
          />
        ))}
      </form>
      <button onClick={() => onSearch()}>OUIIIIIIIIIII</button>

      <div className="search-container">
        <div className="title">My Notifs</div>

        {me != null &&
          me.notifs.map((notif) => (
            <div className="notif-item">
              <div className="icon"></div>
              <div className="type">{notif.type}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
