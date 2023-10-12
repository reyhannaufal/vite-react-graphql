import { Helmet } from "react-helmet";

type SEOProps = {
  title: string;
  description?: string;
  lang?: string;
};

export const WrappedSEO: React.FC<SEOProps> = ({
  title,
  description = "",
  lang = "en",
}) => {
  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={title}
      meta={[
        {
          name: "description",
          content: description,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content: description,
        },
      ]}
      link={[{ rel: "icon", type: "image/ico", href: "/favicon.ico" }]}
    />
  );
};
