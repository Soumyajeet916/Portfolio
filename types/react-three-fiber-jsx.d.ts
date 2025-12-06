// Provide a lightweight mapping so TypeScript can resolve the react-three-fiber jsx runtime
declare module '@react-three/fiber/jsx-runtime' {
  export * from 'react/jsx-runtime';
}
