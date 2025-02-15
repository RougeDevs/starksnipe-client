"use client";
import { Box } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { ParticleConfig } from './Particleconfig';

const ParticleBackground = () => {
    const particlesInit = useCallback(async (engine: any) => {
        await loadFull(engine);
    }, []); // Add an empty dependency array

    const particlesLoaded = useCallback(async (container: any) => {
        // console.log(container); // Removed the await here
    }, []); // Add an empty dependency array

    return (
        <Box>
            <Particles
                id='tsparticles'
                init={particlesInit as any}
                loaded={particlesLoaded}
                options={ParticleConfig as any}
                height='100vh'
                width='100vw'
            />
        </Box>
    );
};

export default ParticleBackground;