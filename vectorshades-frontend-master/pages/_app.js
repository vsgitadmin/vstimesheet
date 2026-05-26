import { useState, useEffect, createContext } from "react";
import "../styles/globals.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "reactjs-popup/dist/index.css";
import Layout from "../src/Layouts";
import "../styles/globals.css";
import { useRouter } from "next/router";
import instance from "../src/Axios/Axios.config";
import { RoutesPermission } from "../src/Constants/Routes/Permission";
import { PublicRoutes } from "../src/Constants/Routes/PublicRoutes";
import { logoutEmployeeController } from "../src/Controllers/Employee/index";
import LogoutTimer from "../src/Components/LogoutTImer";
import Head from "next/head";
import { PagesTopLoader } from 'nextjs-toploader/pages';


export const ParentStore = createContext(null);

function MyApp({ Component, pageProps }) {
  const [ParentState, setParentState] = useState(null);
  const [StateLoading, setStateLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      if (ParentState)
        sessionStorage.setItem("data", JSON.stringify(ParentState));
    });
  });

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  let timeoutId = null;

  function resetTimeout() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(logout, 60000); // 10 minutes
  }

  async function logout() {
    return null;
  }

  useEffect(() => {
    if (
      !sessionStorage.getItem("cache") &&
      !PublicRoutes.includes(router.pathname)
    )
      router.push("/auth/login");
  }, [router.pathname]);

  useEffect(() => {
    let data = sessionStorage.getItem("data");
    if (data) {
      data = JSON.parse(data);
      setStateLoading(true);
      setParentState(data);
      if (data && router.pathname !== "/auth/login") {
        instance.interceptors.request.use(function (config) {
          config.headers.Authorization = "Bearer " + `${data.auth.token}`;
          return config;
        });
      }
      if (
        !PublicRoutes.includes(router.pathname) &&
        router.pathname.search("/dashboard") != -1
      ) {
        const filteredPermission = RoutesPermission.filter(
          (data) =>
            router.pathname.split("/dashboard")[1].search(data.path) != -1
        );
        if (
          filteredPermission.length > 0 &&
          filteredPermission[0].roles.includes(data.auth.role) === false
        ) {
          router.push("/admin/dashboard");
          toast("Access Revoked for the page");
        }
      }
      sessionStorage.removeItem("data");
      sessionStorage.setItem("cache", true);
      setStateLoading(false);
    } else {
      setStateLoading(false);
    }
    document.addEventListener("mousemove", resetTimeout);
    resetTimeout();
  }, []);

  // useEffect(() => {
  //   const onBeforeUnload = async () => await logoutEmployeeController();
  //   const onPageHide = async () => await logoutEmployeeController();
  //   const onVisibilityChange = async () => { if (document.visibilityState === "hidden") await logoutEmployeeController(); };

  //   window.addEventListener("beforeunload", onBeforeUnload);
  //   window.addEventListener("pagehide", onPageHide);
  //   document.addEventListener("visibilitychange", onVisibilityChange);

  //   return () => {
  //     window.removeEventListener("beforeunload", onBeforeUnload);
  //     window.removeEventListener("pagehide", onPageHide);
  //     document.removeEventListener("visibilitychange", onVisibilityChange);
  //   };
  // }, []);

  useEffect(() => {
    if (ParentState && !PublicRoutes.includes(router.pathname)) {
      const filteredPermission = RoutesPermission.filter(
        (data) => router.pathname.split("/dashboard")[1].search(data.path) != -1
      );
      if (
        filteredPermission.length > 0 &&
        filteredPermission[0].roles.includes(ParentState?.auth.role) === false
      ) {
        router.push("/admin/dashboard");
        toast("Access Revoked for the page");
      }
    }
  }, [router.pathname]);

  if (!StateLoading)
    return (
      <ParentStore.Provider value={{ ParentState, setParentState }}>
        <Head>
          {" "}
          <title>VECTORSHADES MANAGEMENT PANEL </title>{" "}
        </Head>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          className="my-toast-container"
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Layout>
          <PagesTopLoader color="#e64848" />
          <Component {...pageProps} />
        </Layout>
      </ParentStore.Provider>
    );
}

export default MyApp;
