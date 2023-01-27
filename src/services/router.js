import { signal } from '../services/anchor.js';
import { tools } from '../services/util.js';

const routing = (() => {

    // randomize event name preventing user custom events from colliding with anchorjs 
    const urlchange = `anchorjs-urlchange-${tools.generate.uuid()}`;

    let routerRunning = false;
    let basehref = '';

    let routes = [];
    
    const activeRoute = signal({
        name : '',
        path : '',
        uri : '',
        params : {},
        query : {},
    });

    const util = (() => {
        const paramRe = /^:(.+)/;

        const SEGMENT_POINTS = 4;
        const STATIC_POINTS = 3;
        const DYNAMIC_POINTS = 2;
        const SPLAT_PENALTY = 1;
        const ROOT_POINTS = 1;

        const startsWith = (str, search) => str.substring(0, search.length) === search;
        const isDynamic = (segment) => paramRe.test(segment);
        const isRootSegment = (segment) => segment === "";
        const isSplat = (segment) => segment[0] === "*";

        const stripSlashes = (str) => str.replace(/(^\/+|\/+$)/g, "");
        const segmentize = (uri) => stripSlashes(uri).split("/");

        const rankRoute = (route, index) => {
            const score = route.default ? 0 : segmentize(route.path).reduce((score, segment) => {
                score += SEGMENT_POINTS;
        
                if (isRootSegment(segment)) score += ROOT_POINTS;
                else if (isDynamic(segment)) score += DYNAMIC_POINTS;
                else if (isSplat(segment)) score -= SEGMENT_POINTS + SPLAT_PENALTY;
                else score += STATIC_POINTS;

                return score;
            }, 0);
          
            return { route, score, index };
        }

        const rankRoutes = (routes) => routes.map(rankRoute).sort((a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index);

        return { startsWith, isDynamic, isRootSegment, isSplat, segmentize, rankRoute, rankRoutes };
    })();

    const setupEventListener = () => {
        const pushState = window.history.pushState;
        const replaceState = window.history.replaceState;

        window.history.pushState = function() {
            pushState.apply(history, arguments);
            window.dispatchEvent(new Event(urlchange));
        };

        window.history.replaceState = function() {
            replaceState.apply(history, arguments);
            window.dispatchEvent(new Event(urlchange));
        };

        window.addEventListener('popstate', function() {
            window.dispatchEvent(new Event(urlchange))
        });
    }

    const router = ({ base, routes }) => {
        if (routerRunning) return console.error("router(): router is already running.");
        routerRunning = true;

        if (base) basehref = base;
        
        setupEventListener();

        window.addEventListener(urlchange, (e) => {
            console.log("Resolve");
        });

        // setTimeout(() => window.history.pushState(null, null, 'home'), 4000);

        const anchor = new Text();
        
        return anchor;
    }

    const navigate = (to, { state, replace } = { state : null, replace : false }) => {
        window.history[(replace === true) ? 'replaceState' : 'pushState'](state, null, to);
    }

    const link = (node) => {
        let href = (node.href) ? (new URL(node.href)).pathname : '';
    
        const hasRoot = (href.substring(0, basehref.length) === basehref);
        if (href.substring(0,1) === '/') href.slice(0,1);
        const link = `${!hasRoot ? basehref : ''}${href}`;
        
        node.href = link;
        node.onclick = () => {
            history.pushState(null, null, link);
            return false; // prevent default of refreshing the page
        }
    }    

    return { router, link, navigate, activeRoute };
})();

export const { router, link, navigate, activeRoute } = routing;