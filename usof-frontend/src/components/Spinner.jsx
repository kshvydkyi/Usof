const SpinnerLoading = ({style=''}) => {
  return (
    <>
     <div className={`${style?.style} lds-dual-ring` }></div>
    </>
  );
}

export default SpinnerLoading;