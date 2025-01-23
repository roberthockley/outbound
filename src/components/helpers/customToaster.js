import styled from 'styled-components';
import { Toaster } from '@twilio-paste/core/toast';

const CustomToasterWrapper = styled.div`
  position: fixed;
  top: 50px; // Adjust this value if you want some space from the top
  left: 0;
  right: 0;
  z-index: 9999; // Ensure it's above other content

  @media (min-width: 768px) {
    top: 100px; // Adjust this value for larger screens if needed
  }
`;

const CustomToaster = (props) => (
    <Toaster {...props} />
);

export default CustomToaster;
