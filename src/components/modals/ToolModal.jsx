import React, { lazy, Suspense } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    font-size: 1.5rem;
    margin: 0;
  }
  
  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const toolComponents = {
  'PdfMerger': lazy(() => import('../tools/PdfMerger')),
  'PdfSplitter': lazy(() => import('../tools/PdfSplitter')),
  'PdfConverter': lazy(() => import('../tools/PdfConverter')),
  'PdfCompressor': lazy(() => import('../tools/PdfCompressor')),
  'PdfEditor': lazy(() => import('../tools/PdfEditor')),
  'PdfReader': lazy(() => import('../tools/PdfReader')),
  'PdfProtector': lazy(() => import('../tools/PdfProtector')),
  'PdfUnlocker': lazy(() => import('../tools/PdfUnlocker')),
  'PdfOcr': lazy(() => import('../tools/PdfOcr')),
  'BackgroundRemover': lazy(() => import('../img-tools/BackgroundRemover')),
  'BatchProcessor': lazy(() => import('../img-tools/BatchProcessor')),
  'CollageMaker': lazy(() => import('../img-tools/CollageMaker')),
  'GifMaker': lazy(() => import('../img-tools/GifMaker')),
  'ImageCompressor': lazy(() => import('../img-tools/ImageCompressor')),
  'ImageEditor': lazy(() => import('../img-tools/ImageEditor')),
  'ImageFormatConverter': lazy(() => import('../img-tools/ImageFormatConverter')),
  'ImageToPdf': lazy(() => import('../img-tools/ImageToPdf')),
  'ImgToolsSection': lazy(() => import('../img-tools/ImgToolsSection')),
  'MemeGenerator': lazy(() => import('../img-tools/MemeGenerator')),
  'PdfToImage': lazy(() => import('../img-tools/PdfToImage')),
  'PhotoEnhancer': lazy(() => import('../img-tools/PhotoEnhancer')),
  'WatermarkTool': lazy(() => import('../img-tools/WatermarkTool')),
  'DocConverter': lazy(() => import('../doc-tools/DocConverter')),
  'DocMerger': lazy(() => import('../doc-tools/DocMerger')),
  'DocSplitter': lazy(() => import('../doc-tools/DocSplitter')),
  'DocEditor': lazy(() => import('../doc-tools/DocEditor')),
  'DocProtector': lazy(() => import('../doc-tools/DocProtector')),
  'DocUnlocker': lazy(() => import('../doc-tools/DocUnlocker')),
  'DocToPdf': lazy(() => import('../doc-tools/DocToPdf')),
  'PdfToDoc': lazy(() => import('../doc-tools/PdfToDoc')),
  'DocOcr': lazy(() => import('../doc-tools/DocOcr')),
  'DocWatermark': lazy(() => import('../doc-tools/DocWatermark')),
  'DocFormatter': lazy(() => import('../doc-tools/DocFormatter')),
  'DocConverterAdvanced': lazy(() => import('../doc-tools/DocConverterAdvanced'))
};

export default function ToolModal({ tool, onClose }) {
  const ToolComponent = tool ? toolComponents[tool.component] : null;

  return (
    <AnimatePresence>
      {tool && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <h3>{tool.name}</h3>
              <button onClick={onClose} aria-label="Close modal">
                <FiX />
              </button>
            </ModalHeader>
            <ModalBody>
              <Suspense fallback={<div>Loading tool...</div>}>
                {ToolComponent && <ToolComponent onClose={onClose} />}
              </Suspense>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
}
