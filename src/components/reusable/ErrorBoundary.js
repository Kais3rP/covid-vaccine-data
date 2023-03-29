import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
  }

  render() {
    const { children } = this.props;
    return this.state.error ? (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#FFF",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h2>
          Something went wrong.
          <button
            style={{
              backgroundColor: "green",
              color: "#FFF",
              borderRadius: "5px",
              paddiong: "10px",
              fontSize: "1.2rem",
              margin: "0px 5px 0px 5px",
              cursor: "pointer",
            }}
            onPointerDown={() => window.location.reload()}
          >
            Retry
          </button>
        </h2>
        <details style={{ whiteSpace: "pre-wrap" }}>
          {this.state.error?.toString()}
          <br />
          {this.state.info?.componentStack}
        </details>
      </div>
    ) : (
      children
    );
  }
}
