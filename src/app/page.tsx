import Image from "next/image";
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.background}>

      <div className={styles.textContainer} style={{ zIndex: '4'}}>
        <div className={styles.landingText}>
          <h1>
            <span style={{color: 'green'}}>Social & Sustainable </span>
            Investing<br/>
            <span className={styles.rainbowText}>Reimagined</span>
          </h1>
          <p>Your all in one platform for responsible investing</p>
        </div>
        
      </div>
      <div className={styles.ellipse}/>
    </div>
  );
}
