export default function OpenStackNoVNC({ consoleUrl }: { consoleUrl: string }) {
  return (
    <iframe
      id="console"
      title="console"
      src={consoleUrl}
      style={{
        width: '100%',
        flexGrow: '1',
        display: 'block',
      }}
    />
  )
}
