import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout/layout.component';
import { PersonDetailsComponent } from './components/person-details/person-details.component';
import { MovieDetailsComponent } from './components/movie/movie-details/movie-details.component';
import { MovieComponent } from './components/movie/movie/movie.component';
import { WatchListComponent } from './components/watch-list/watch-list.component';
import { SearchComponent } from './components/search/search.component';

export const routes: Routes = [
    {
        path: "", component: LayoutComponent, children: [
            { path: "", component: MovieComponent },
            { path: "person/:id", component: PersonDetailsComponent },
            { path: "movie/:id", component: MovieDetailsComponent }, 
            { path: "watchlist", component: WatchListComponent }, 
            { path: "search", component: SearchComponent }, 
        ]
    },
    { path: "", pathMatch: "full", redirectTo: "/" },
    { path: '**', redirectTo: '/' }
];
