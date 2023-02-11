import { IFrame } from './iframe';

type HtmlRootProps = Omit<React.IframeHTMLAttributes<HTMLIFrameElement>, 'src'> & {
  code?: string;
  iframeStyle?: React.CSSProperties;
};

export const HtmlRoot = ({ code, ...props }: HtmlRootProps) => {
  if (code === undefined) {
    return null;
  }

  return (
    <IFrame
      message={code}
      handleMessage={(code) => {
        document.body.innerHTML = code;
      }}
      {...props}
    />
  );
};
