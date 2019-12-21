class Maze
{
    constructor(size)
    {
        this.size = size;
        this.start = [];
        this.current = [];
        this.goal = [];
        this.grid = this.createMaze(size);
        this.solution = [];
        this.shortest_sol = this.Dijkstra();
    }

    createMaze(size)
    {
        let mazeGrid = [];
        let row;

        for(let i=0;i<size;i++)
        {
            row = [];
            for(let j=0;j<size;j++)
            {
                let isBlank = (Math.floor(10*Math.random()) < 6);
                row.push(isBlank ? '' : 'X');
            }

            mazeGrid.push(row);
        }

        let pRow = Math.floor(size*Math.random());
        let pCol = Math.floor(size*Math.random());
        mazeGrid[pRow][pCol] = 'P';
        this.start = [pRow,pCol];
        this.current = [pRow,pCol];

        let gRow = Math.floor(size*Math.random());
        let gCol = Math.floor(size*Math.random());
        while(mazeGrid[gRow][gCol] == 'P')
        {
            gRow = Math.floor(size*Math.random());
            gCol = Math.floor(size*Math.random());
        }
        mazeGrid[gRow][gCol] = 'G';
        this.goal = [gRow,gCol];

        return mazeGrid;
    }

    showMaze()
    {
        console.table(this.grid);
    }

    isSolvable()
    {
        let isPFound = false;
        let pRow, pCol;

        for(let i=0;i<this.size;i++)
        {
            for(let j=0;j<this.size;j++)
            {
                if(this.grid[i][j]==='P')
                {
                    pRow = i;
                    pCol = j;
                    isPFound = true;
                    break;
                }
            }

            if(isPFound)
            {
                break;
            }
        }

        if(!isPFound)
        {
            return false;
        }

        return this.findPath(pRow,pCol,[]);
    }

    findPath(pRow,pCol,visited,gRow = this.goal[0], gCol = this.goal[1])
    {
        let isVisited = false;
        for(let i=0;i<visited.length;i++)
        {
            if(visited[i][0]===pRow && visited[i][1]===pCol)
            {
                isVisited = true;
            }
        }

        if(this.grid[pRow] == undefined || this.grid[pRow][pCol] == undefined || this.grid[pRow][pCol]==='X' || isVisited)
        {
            return false;
        }
        else if(pRow == gRow && pCol == gCol)
        {
            let newVisited = [];
            for(let i=0;i<visited.length;i++)
            {
                newVisited.push(visited[i]);
            }
            newVisited.push([pRow,pCol]);

            let rowChange, colChange;
            for(let i=1;i<newVisited.length;i++)
            {
                rowChange = newVisited[i][0] - newVisited[i-1][0];
                colChange = newVisited[i][1] - newVisited[i-1][1];

                if(colChange === 0)
                {
                    switch(rowChange)
                    {
                        case 1:
                            this.solution.push('down');
                            break;
                        case -1:
                            this.solution.push('up');
                            break;
                    }
                }
                else
                {
                    switch(colChange)
                    {
                        case 1:
                            this.solution.push('right');
                            break;
                        case -1:
                            this.solution.push('left');
                            break;
                    }
                }
            }

            return true;
        }

        let newVisited = [];
        for(let i=0;i<visited.length;i++)
        {
            newVisited.push(visited[i]);
        }
        newVisited.push([pRow,pCol]);

        let allowedStep = [[-1,0],[1,0],[0,-1],[0,1]];
        let n = Math.floor(Math.random()*allowedStep.length);
        for(let m=0;m<allowedStep.length;m++)
        {
            if(this.findPath(pRow+allowedStep[n][0],pCol+allowedStep[n][1],newVisited))
            {
                
                return true;
            }
            n = (n+1)%allowedStep.length;
        }

        
        return false;
    }

    setGrid(newGrid)
    {
        if(!Array.isArray(newGrid))
        {
            console.log("Invalid grid. No changes made.");
            return false;
        }

        if(newGrid.length != this.size)
        {
            console.log("Invalid grid. No changes made.");
            return false;
        }

        for(let i=0;i<newGrid.length;i++)
        {
            if(!Array.isArray(newGrid[i]))
            {
                console.log("Invalid grid. No changes made.");
                return false;
            }

            if(newGrid[i].length != this.size)
            {
                console.log("Invalid grid. No changes made.");
                return false;
            }

            for(let j=0;j<newGrid[i].length;j++)
            {
                if(newGrid[i][j] != '' && newGrid[i][j] != 'X' && newGrid[i][j] != 'P' && newGrid[i][j] != 'G')
                {
                    return false;
                }
            }
        }

        this.grid = [];
        let row;
        for(let i=0;i<this.size;i++)
        {
            row = [];
            for(let j=0;this.size;j++)
            {
                row.push(newGrid[i][j]);
            }
            this.grid.push(row);
        }

        for(let i=0;i<this.size;i++)
        {
            for(let j=0;j<this.size;j++)
            {
                if(this.grid[i][j]==='P')
                {
                    this.start = [i,j];
                }
                if(this.grid[i][j]==='G')
                {
                    this.goal = [i,j];
                }
            }

        }
    }

    Dijkstra()
    {
        let shortest_sol = [];
        if(!this.isSolvable())
        {
            return [];
        }
        else
        {
            let prev_dist = [];
            let Q = [];
            for(let i=0;i<this.size;i++)
            {
                let row = [];
                for(let j=0;j<this.size;j++)
                {
                    row.push({prev: [null,null], dist: Infinity});
                    if(this.findPath(i,j,[]))
                    {
                        Q.push([i,j]);
                    }
                    
                }

                prev_dist.push(row);
            }

            prev_dist[this.start[0]][this.start[1]].dist = 0;

            while(Q.length != 0) 
            {
                //console.table(prev_dist);
                let nearest = [null,null];
                nearest[0] = Q[0][0];
                nearest[1] = Q[0][1];
                let nearest_i = 0;
                for(let i=1;i<Q.length;i++)
                {
                    if(prev_dist[ Q[i][0] ][ Q[i][1] ].dist < prev_dist[ nearest[0] ][ nearest[1] ].dist)
                    {
                        nearest[0] = Q[i][0];
                        nearest[1] = Q[i][1];
                        nearest_i = i;
                    }
                }
                
                let allowedStep = [[-1,0],[1,0],[0,-1],[0,1]];
                for(let m=0;m<allowedStep.length;m++) // get neighbors and 'relax'
                {
                    let nbRow = nearest[0]+allowedStep[m][0];
                    let nbCol = nearest[1]+allowedStep[m][1];
                    let nbInQ = false;

                    for(let i=0;i<Q.length;i++)
                    {
                        if(Q[i][0] == nbRow && Q[i][1] == nbCol)
                        {
                            nbInQ = true;
                        }
                    }

                    if(prev_dist[nbRow] != undefined && prev_dist[nbRow][nbCol] != undefined && prev_dist[nearest[0]][nearest[1]].dist + 1 < prev_dist[nbRow][nbCol].dist && this.findPath(nbRow,nbCol,[]) && nbInQ)
                    {
                        prev_dist[nbRow][nbCol].dist = prev_dist[nearest[0]][nearest[1]].dist + 1;
                        prev_dist[nbRow][nbCol].prev[0] = nearest[0];
                        prev_dist[nbRow][nbCol].prev[1] = nearest[1];
                    }
                }


                
                if(nearest[0] == this.goal[0] && nearest[1] == this.goal[1]) // done
                {
                    let curNode = [this.goal[0],this.goal[1]];
                    let nodePath = [];
                    while(curNode[0] != null && curNode[1] != null)
                    {
                        nodePath.unshift(curNode);
                        curNode = prev_dist[curNode[0]][curNode[1]].prev;
                    }
                    
                    let rowChange, colChange;
                    for(let i=1;i<nodePath.length;i++)
                    {
                        rowChange = nodePath[i][0] - nodePath[i-1][0];
                        colChange = nodePath[i][1] - nodePath[i-1][1];
        
                        if(colChange === 0)
                        {
                            switch(rowChange)
                            {
                                case 1:
                                    shortest_sol.push('down');
                                    break;
                                case -1:
                                    shortest_sol.push('up');
                                    break;
                            }
                        }
                        else
                        {
                            switch(colChange)
                            {
                                case 1:
                                    shortest_sol.push('right');
                                    break;
                                case -1:
                                    shortest_sol.push('left');
                                    break;
                            }
                        }
                    }
                }

                Q.splice(nearest_i,1);

                
            }

            return shortest_sol;
        }
    }

    moveUp()
    {
        if(this.current[0]-1 >= 0 && this.grid[this.current[0]-1][this.current[1]] != 'X')
        {
            this.grid[this.current[0]][this.current[1]] = '';
            this.grid[this.current[0]-1][this.current[1]] = 'P';
            this.current[0]--;
            return true;
        }

        return false;
    }

    moveDown()
    {
        if(this.current[0]+1 < this.size && this.grid[this.current[0]+1][this.current[1]] != 'X')
        {
            this.grid[this.current[0]][this.current[1]] = '';
            this.grid[this.current[0]+1][this.current[1]] = 'P';
            this.current[0]++;
            return true;
        }

        return false;
    }

    moveLeft()
    {
        if(this.current[1]-1 >= 0 && this.grid[this.current[0]][this.current[1]-1] != 'X')
        {
            this.grid[this.current[0]][this.current[1]] = '';
            this.grid[this.current[0]][this.current[1]-1] = 'P';
            this.current[1]--;
            return true;
        }
        
        return false;
    }

    moveRight()
    {
        if(this.current[1]+1 < this.size && this.grid[this.current[0]][this.current[1]+1] != 'X')
        {
            this.grid[this.current[0]][this.current[1]] = '';
            this.grid[this.current[0]][this.current[1]+1] = 'P';
            this.current[1]++;
            return true;
        }

        return false;
    }

    hasReachedGoal()
    {
        return this.current[0] == this.goal[0] && this.current[1] == this.goal[1];
    }
}

//let maze1 = new Maze(8);
//maze1.showMaze();
//console.log(maze1.isSolvable());
//console.log(maze1.solution);
//console.log(maze1.Dijkstra());

module.exports = Maze;