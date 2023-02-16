// NOTE using grid template column and using fr units will break the width of the slider!

import styles from './Style1.module.scss';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

import {MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight} from 'react-icons/md';

interface Props<T> {
    data: T[],
    children: (data: T) => React.ReactNode,
    slidersPerView?: number,
    pagination?: "fraction" | "bullets" 
}

const Style1 = <T,>({data, children, slidersPerView=5, pagination="fraction"}: Props<T>) => {

    const [realIndex, setRealIndex] = useState(1)

    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);

    const pages = data.length === 1 ? 1 : - slidersPerView + 1

    return (
        <div className={styles.container}>

           { data.length - 2 > 0 &&
                <div className={styles.navBtn} >
                    <button ref={navigationPrevRef}><MdOutlineKeyboardArrowLeft/></button>
                    {pagination === "fraction" && <small>{realIndex} / {data.length-2}</small>}
                    {pagination === "bullets" && 
                        <div className={styles.bullets}>
                            {[...new Array(pages)].map((_, index) => <button className={`${styles.bullet} ${index+1 === realIndex && styles.selected}`} key={index} />)}
                        </div>
                    }
                    <button ref={navigationNextRef}><MdOutlineKeyboardArrowRight/></button>
                </div>
            }

            {!!data.length && 
                <Swiper 
                    className={styles.swiper}
                    modules={[Navigation, Pagination]} 
                    spaceBetween={5} 
                    slidesPerView={slidersPerView} 
                    onRealIndexChange={(el) => setRealIndex(el.activeIndex+1) }
                    navigation={{
                        prevEl: navigationPrevRef.current,
                        nextEl: navigationNextRef.current,
                    }} 
                >

                    {data.map((element, index) => 
                        <SwiperSlide key={index}>
                            {children(element)}
                        </SwiperSlide>
                    )}

                </Swiper>
            }

        </div>
  )
}

export default Style1