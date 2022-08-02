import React, { useState } from "react";
import Demo2 from "./Demo2";
import Demo3 from "./Demo3";

function Demo1() {
  const [data, setData] = useState<string>("");

  return (
    <div>
      <h1>This is Demo1 component</h1>
      <div>
        <Demo2 data={data} setData={setData} />
        <Demo3 data={data} setData={setData} />
      </div>
    </div>
  );
}

export default Demo1;
