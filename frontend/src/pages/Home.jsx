import { useEffect, useState } from "react";
import "../styles/home.scss";
import { getToken } from "../store/slices/authSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  Age,
  ArrowRight,
  CogIcon,
  Fire,
  MapPin,
  TriangleIcon,
} from "../components/icons/Icons";
import { useSocket } from "../utils/PrivateRoutes";
import { initialiseUser, selectUser } from "../store/slices/userSlice";
import { Autocomplete, Slider, TextField, Tooltip } from "@mui/material";
import UserCard from "../components/UserCard";
import SearchSchema from "../schemas/SearchSchema";
import { useFormik } from "formik";
import TagEnum from "../Enum/TagEnum";
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
  const [openSearchParm, setOpenSearchParm] = useState(false);
  const initialValueSort = {
    name: 0,
    fame: 0,
    position: 0,
    tags: 0,
  };
  const [sortResult, setSortResult] = useState(initialValueSort);
  const searchFormik = useFormik({
    validationSchema: SearchSchema(),
    initialValues: {},
    onSubmit: (values) => onSearch(values),
  });

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

  const onUpdateStatus = ({ user_id /*, status */ }) => {
    if (user_id != me.id) searchFormik.submitForm();
  };

  useEffect(() => {
    if (socket) socket.on("update-status", onUpdateStatus);

    return () => {
      if (socket) socket.off("update-status", onUpdateStatus);
    };
  }, [socket]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (Object.keys(searchFormik.values).length) {
        searchFormik.submitForm();
      }
    }, 1500);
    return () => clearTimeout(id);
  }, [searchFormik.values]);

  useEffect(() => {
    if (sortResult.name > 0) sortByName();
    else if (sortResult.fame > 0) sortByFame();
    else if (sortResult.position > 0) sortByPosition();
    else if (sortResult.tags > 0) sortByTags();
  }, [sortResult]);

  const sortByName = () => {
    const sortedArray = [...allUsers].sort((a, b) => {
      const nameA = a.username.toLowerCase();
      const nameB = b.username.toLowerCase();

      if (nameA < nameB) return sortResult.name <= 1 ? -1 : 1;
      if (nameA > nameB) return sortResult.name <= 1 ? 1 : -1;
      return 0;
    });

    setAllUsers(sortedArray);
  };

  const sortByFame = () => {
    const sortedArray = [...allUsers].sort((a, b) => {
      const fameA = a.fame_rate;
      const fameB = b.fame_rate;

      if (fameA < fameB) return sortResult.fame === 2 ? -1 : 1;
      if (fameA > fameB) return sortResult.fame === 2 ? 1 : -1;
      return 0;
    });

    setAllUsers(sortedArray);
  };

  const sortByTags = () => {
    const sortedArray = [...allUsers].sort((a, b) => {
      const commonTagsA = me.tags.filter((tag) =>
        a.tags.map((tag) => tag.tag).includes(tag.tag)
      );
      const commonTagsB = me.tags.filter((tag) =>
        b.tags.map((tag) => tag.tag).includes(tag.tag)
      );

      if (commonTagsA.length < commonTagsB.length)
        return sortResult.tags === 2 ? -1 : 1;
      if (commonTagsA.length > commonTagsB.length)
        return sortResult.tags === 2 ? 1 : -1;
      return 0;
    });

    setAllUsers(sortedArray);
  };

  const sortByPosition = () => {};

  function mySortResult(type) {
    switch (type) {
      case "name":
        setSortResult((prevState) => ({
          ...initialValueSort,
          name: prevState.name <= 0 ? 1 : prevState.name > 1 ? 1 : 2,
        }));
        break;
      case "fame":
        setSortResult((prevState) => ({
          ...initialValueSort,
          fame: prevState.fame <= 0 ? 1 : prevState.fame > 1 ? 1 : 2,
        }));
        break;
      case "position":
        setSortResult((prevState) => ({
          ...initialValueSort,
          position:
            prevState.position <= 0 ? 1 : prevState.position > 1 ? 1 : 2,
        }));
        break;
      case "tags":
        setSortResult((prevState) => ({
          ...initialValueSort,
          tags: prevState.tags <= 0 ? 1 : prevState.tags > 1 ? 1 : 2,
        }));
        break;
      default:
        console.log("Type unknown");
        break;
    }
  }

  return (
    <div className="main">
      <form className="search-container" onSubmit={searchFormik.onSubmit}>
        <div className="title-container">
          <p> {token.access_token} </p>
          <div className="title">Search an user</div>
          <div className="icons">
            <div className="container">
              <Tooltip
                disableHoverListener={me.photos.some((photo) => photo.main)}
                title="You must set a main profile pic to search users."
              >
                <div
                  className={
                    "icon " +
                    (!me.photos.find((photo) => photo.main) ? "disabled" : "")
                  }
                  onClick={() =>
                    !!me.photos.find((photo) => photo.main) &&
                    setOpenSearchParm((prev) => !prev)
                  }
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
            <div className="iconResponsive">
              {" "}
              <Age />{" "}
            </div>
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
              max={122}
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
            <div className="iconResponsive">
              {" "}
              <Fire />{" "}
            </div>
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
            <div className="iconResponsive">
              {" "}
              <MapPin />{" "}
            </div>
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
                <TextField {...params} label="Search by tags" />
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
          {allUsers && (
            <div className="headerResult">
              <h3> Result of your research</h3>
              <div className="sortResult">
                <p> Sort by </p>
                <button
                  className={
                    sortResult.name <= 0
                      ? "inactiveSort"
                      : sortResult.name > 1
                      ? "reverseSort"
                      : "activeSort"
                  }
                  onClick={() => mySortResult("name")}
                >
                  {" "}
                  name <ArrowRight />{" "}
                </button>
                <button
                  className={
                    sortResult.fame <= 0
                      ? "inactiveSort"
                      : sortResult.fame > 1
                      ? "reverseSort"
                      : "activeSort"
                  }
                  onClick={() => mySortResult("fame")}
                >
                  {" "}
                  fame <ArrowRight />
                </button>
                <button
                  className={
                    sortResult.position <= 0
                      ? "inactiveSort"
                      : sortResult.position > 1
                      ? "reverseSort"
                      : "activeSort"
                  }
                  onClick={() => mySortResult("position")}
                >
                  {" "}
                  position? <ArrowRight />
                </button>
                <button
                  className={
                    sortResult.tags <= 0
                      ? "inactiveSort"
                      : sortResult.tags > 1
                      ? "reverseSort"
                      : "activeSort"
                  }
                  onClick={() => mySortResult("tags")}
                >
                  {" "}
                  tags <ArrowRight />
                </button>
              </div>
            </div>
          )}
          <div className="resultCardContainer">
            {allUsers &&
              allUsers.map((user) => (
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
        <div className="findNothing">
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
