class Maze
{
    constructor(size)
    {
        this.size = size;
        this.grid = this.createMaze(size);
        
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

        let gRow = Math.floor(size*Math.random());
        let gCol = Math.floor(size*Math.random());
        while(mazeGrid[gRow][gCol] == 'P')
        {
            gRow = Math.floor(size*Math.random());
            gCol = Math.floor(size*Math.random());
        }
        mazeGrid[gRow][gCol] = 'G';

        return mazeGrid;
    }

    showMaze()
    {
        return this.grid;
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

    findPath(pRow,pCol,visited)
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
        else if(this.grid[pRow][pCol] === 'G')
        {
            return true;
        }

        let newVisited = [];
        for(let i=0;i<visited.length;i++)
        {
            newVisited.push(visited[i]);
        }
        newVisited.push([pRow,pCol]);

        let allowedStep = [[-1,0],[1,0],[0,-1],[0,1]];
        for(let m=0;m<allowedStep.length;m++)
        {
            if(this.findPath(pRow+allowedStep[m][0],pCol+allowedStep[m][1],newVisited))
            {
                return true;
            }
        
        }
        return false;

    }
}

let maze1 = new Maze(8);
console.table(maze1.showMaze());
console.log(maze1.isSolvable());