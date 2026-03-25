export const getPatientColor = (dni: string) => {
    // Paleta Dark/Muted para combinar con Slate/Zinc
    const darkMutedColors = [
        '#64748b', // slate-500 (muted)
        '#475569', // slate-600
        '#52525b', // zinc-600
        '#71717a', // zinc-500
        '#57534e', // stone-600
        '#78716c', // stone-500
    ];

    let hash = 0;
    for (let i = 0; i < dni.length; i++) {
        hash = dni.charCodeAt(i) + ((hash << 5) - hash);
    }
    return darkMutedColors[Math.abs(hash) % darkMutedColors.length];
};
