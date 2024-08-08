import React from 'react';
import { Box, Heading, Text, Image } from '@chakra-ui/react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import tronBanner from '../assets/tronbanner.png';
import tonBanner from '../assets/tonbanner.png';  
import solbanner from '../assets/solbanner.png';
import greenbanner from '../assets/greenbanner.png';

const BannerBox: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <Box textAlign="center" py={10} mb={2} width="100%">
      <Box maxWidth="600px" mx="auto">
        <Heading as="h2" size="2xl" mb={4}>
        Send Multiple Transactions at Once!
        </Heading>
        <Text fontSize="md" mb={4}>
        Enjoy cost-effective blockchain bulk transactions. Ideal for airdrops, payrolls, etc.<br></br>
        Simplify your process, save time and cash with Send Tokens dApp.
        </Text>
      </Box>
      <Box
        position="relative"
        borderRadius="md"
        mx="auto"
        maxWidth="600px"
        bg="transparent"
      >
        <Slider {...settings}>
          <Banner imageUrl={tronBanner} />
          <Banner imageUrl={tonBanner} />
          <Banner imageUrl={solbanner} />
          <Banner imageUrl={greenbanner} />
        </Slider>
      </Box>
    </Box>
  );
};

const Banner: React.FC<{ imageUrl: string }> = ({ imageUrl }) => (
  <Box>
    <Image src={imageUrl} alt="Banner" borderRadius="md" width="100%" height="auto" />
  </Box>
);

export default BannerBox;
