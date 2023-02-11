import { IFrame } from './iframe';

declare var ReactDOM: any;

type ReactRootProps = Omit<React.IframeHTMLAttributes<HTMLIFrameElement>, 'src'> & {
  component: string;
  props?: unknown;
  code?: string;
  iframeStyle?: React.CSSProperties;
  reactVersion?: string | number;
};

export const ReactRoot = ({
  component,
  props: componentProps = {},
  code,
  reactVersion = 'latest',
  ...props
}: ReactRootProps) => {
  if (code === undefined) {
    return null;
  }

  return (
    <IFrame
      message={`${code}\nreturn React.createElement(${component}, ${JSON.stringify(componentProps)})`}
      handleMessage={(code) => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(new Function(code)());
      }}
      {...props}
    >
      <div id="root" />

      <script
        crossOrigin="anonymous"
        src={`https://unpkg.com/react@${reactVersion}/umd/react.production.min.js`}
      />

      <script
        crossOrigin="anonymous"
        src={`https://unpkg.com/react-dom@${reactVersion}/umd/react-dom.production.min.js`}
      />
    </IFrame>
  );
};
