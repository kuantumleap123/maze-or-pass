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
                let isBlank = (Math.floor(10*Math.random()) < 7);
                row.push(isBlank ? '' : 'X');
            }

            mazeGrid.push(row);
        }

        let pRow = Math.floor(size*Math.random());
        let pCol = Math.floor(size*Math.random());
        mazeGrid[pRow][pCol] = 'P';

        let gRow = Math.floor(size*Math.random());
        let gCol = Math.floor(size*Math.random());
        while(mazeGrid[pRow][pCol] == 'P')
        {
            gRow = Math.floor(size*Math.random());
            gCol = Math.floor(size*Math.random());
        }
        mazeGrid[pRow][pCol] = 'G';

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

    }
}

