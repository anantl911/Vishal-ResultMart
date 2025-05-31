import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Checkmark = (props) => {
  return (
    <DotLottieReact
      src={props.success ? `https://lottie.host/11d3eb28-954d-441e-9501-8c47bf93cb34/E9ANCHrFKP.lottie` :
                           `https://lottie.host/18468506-7822-472c-9010-0e5337ca906b/w3P5D5Kb4V.lottie`}
      autoplay
    />
  );
};

export default Checkmark;