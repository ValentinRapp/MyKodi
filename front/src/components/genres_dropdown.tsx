export function GenresDropdown(props: { genres: string[], selectedGenres: string[], setSelectedGenres: (genres: string[]) => void }) {
    return (
        <details className="dropdown">
            <summary className="btn m-1">Filters</summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                {props.genres.map(genre => (
                    <li key={genre}>
                        <label className="cursor-pointer">
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={props.selectedGenres.find(element => element === genre) ? true : false}
                                onChange={e =>
                                    props.setSelectedGenres(
                                        e.target.checked 
                                            ?
                                        [...props.selectedGenres, genre] 
                                            :
                                        props.selectedGenres.filter(element => element !== genre)
                                    )
                                }
                            />
                            <span>{genre}</span>
                        </label>
                    </li>
                ))}
            </ul>
        </details>
    )
}