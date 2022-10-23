import classNames from "classnames";
import React, { useEffect, useState, useRef } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { isSupportWebp } from "../../lib/init";
import { useImageFullyLoaded } from "../../lib/hooks";
import IconUp from "../icons/IconUp";
import styles from "./WikiPicture.module.scss";

const FullyLoadedImage = new Set();

/**
 * 百科正文和其它组件中的图片组件
 */
export default function WikiPicture(props) {
  const { alt, clickable = true, normalSuffix = "/normal" } = props;
  const [suffix, setSuffix] = useState(normalSuffix + ".jpg");
  const [webpSuffix, setWebpSuffix] = useState(normalSuffix + ".webp");
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  const _src = String(props.src).split("%7C%7C");
  const src = _src?.[0] ? _src[0] : _src;
  const imageSize = _src?.[1] ? _src[1] : "x";
  const [imageURL, setImageURL] = useState(src + webpSuffix);
  const [originImageURL, setOriginImageURL] = useState(src + "/normal.webp");

  const imageWidth = imageSize.split("x")[0] || "1024";
  const imageHeight = imageSize.split("x")[1] || "576";

  const imageElRef = useRef(null);

  const isPreFetchBot = () => {
    const search = window.location.search;
    const URLSearchParams = window.URLSearchParams;
    return (
      URLSearchParams && !!(new URLSearchParams(search).get("bot") === "1")
    );
  };

  const isGif = () => {
    return src && String(src).endsWith(".gif");
  };

  useEffect(() => {
    const _suffix = normalSuffix + (isSupportWebp() ? ".webp" : ".jpg");
    setImageURL(src + (isGif() ? "" : _suffix));
    setOriginImageURL(src + "/normal" + (isSupportWebp() ? ".webp" : ".jpg"));
  }, [src]);

  const isImageFullyLoaded = useImageFullyLoaded(imageElRef, imageURL);

  return (
    <div className={styles.picture}>
      <div className={styles.box}>
        <PhotoProvider maskOpacity={0.8}>
          <div className={styles.placeholder}>
            <div
              className={styles.loadingBox}
              style={{
                backgroundColor: isImageFullyLoaded ? undefined : "#eee",
              }}
            >
              <img
                width={imageWidth}
                height={imageHeight}
                alt={alt}
                src={`data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27${imageWidth}%27%20height=%27${imageHeight}%27/%3e`}
              />
            </div>
            <PhotoView src={originImageURL} key={originImageURL}>
              <img
                className={styles.realImage}
                width={imageWidth}
                height={imageHeight}
                ref={imageElRef}
                decoding="async"
                crossOrigin="anonymous"
                src={imageURL}
                alt={alt}
                title={alt}
              />
            </PhotoView>
          </div>
        </PhotoProvider>
      </div>
      {alt && (
        <label className={styles.description}>
          <div className={styles.tips}>
            <div className={styles.tipsIcon}>
              <IconUp />
            </div>
            {alt}
          </div>
          <div className={styles.tipsItem}>（点击可查看大图）</div>
        </label>
      )}
    </div>
  );
}
