import styled from 'styled-components';
import { motion } from 'framer-motion';
import FeatureCard from './FeatureCard';

const FeaturesContainer = styled(motion.section)`
  padding: 5rem 10%;
  background-color: ${({ theme }) => theme.colors.neutral.offWhite};
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary.navy};
  margin-bottom: 3rem;
  text-align: center;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  justify-items: center;
`;

const featureItems = [
  {
    title: 'Modern Design',
    description: 'Cutting-edge design principles with a focus on user experience',
    frontDescription: 'Beautiful interfaces that captivate your audience'
  },
  {
    title: 'Smooth Animations',
    description: 'Micro-interactions and transitions that delight users',
    frontDescription: 'Engaging animations that bring your site to life'
  },
  {
    title: 'Responsive Layout',
    description: 'Flawless experience across all device sizes',
    frontDescription: 'Looks great on any screen'
  }
];

export default function Features() {
  return (
    <FeaturesContainer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Title>Our Features</Title>
      <CardsGrid>
        {featureItems.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            frontDescription={feature.frontDescription}
          />
        ))}
      </CardsGrid>
    </FeaturesContainer>
  );
}