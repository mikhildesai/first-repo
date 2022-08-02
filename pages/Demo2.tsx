import React from "react";

function Demo2({ data, setData }: any) {
  const handleChange = (e: any) => {
    setData(e.target.value);
    console.log(data);
  };
  return (
    <div>
      <h1> This is demo2 component</h1>
      <form>
        <label>email</label>
        <input type="email" value={data} onChange={handleChange} />
        <label>password</label>
        <input type="password" />
        <button type="submit" className="btn btn-primary">
          Click
        </button>
      </form>
    </div>
  );
}

export default Demo2;
