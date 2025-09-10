import {useSongData} from "../context/SongContext.tsx";
import Layout from "../Components/Layout.tsx";
import AlbumCard from "../Components/AlbumCard.tsx";
import SongCard from "../Components/SongCard.tsx";
import Loading from "../Components/Loding.tsx";


const Home = () => {
    const {albums, songs, loading} = useSongData()
    return (
        <div>
            {loading ? (<Loading/>) :
                (<Layout>
                <div className={'mb-4'}>
                    <h1 className={'my-5 font-bold text-2xl'}>
                        Featured Card
                    </h1>
                    <div className={'flex overflow-hidden'}>
                        {
                            albums?.map((item, index) => {
                                return (
                                    <AlbumCard key={index} image={item.thumbnail} name={item.title}
                                               desc={item.discription} id={item.id}/>
                                )
                            })
                        }

                    </div>
                </div>

                <div className={'mb-4'}>
                    <h1 className={'my-5 font-bold text-2xl'}>
                        Today's biggest hits
                    </h1>
                    <div className={'flex overflow-hidden'}>
                        {
                            songs?.map((item, index) => {
                                return (
                                    <SongCard key={index} image={item.thumbnail} name={item.title}
                                              desc={item.discription} id={item.id}/>
                                )
                            })
                        }

                    </div>
                </div>
            </Layout>)}
        </div>
    );
}

export default Home;
