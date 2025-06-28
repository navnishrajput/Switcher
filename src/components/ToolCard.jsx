import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border: 1px solid #e0e0e0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    border-color: #3498db;
  }
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  color: ${({ color }) => color || '#3498db'};
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin: 0;
`;

export default function ToolCard({ title, description, icon, path, color }) {
  return (
    <Card onClick={() => window.location.href = path}>
      <IconWrapper color={color}>{icon}</IconWrapper>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Card>
  );
}
